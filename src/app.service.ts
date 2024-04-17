import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AccountDtO } from './dto/Account.dto';
import { FxConversionDto } from './dto/FxConversion.dto';
//for 30 seconds
const exchangeRatesMap: Map<string, { rate: number, expiryAt: number }> = new Map();
setTimeout(() => {
  Array.from(exchangeRatesMap.keys()).forEach(currencyPair => {
    axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currencyPair.split('-')[0]}&to_currency=${currencyPair.split('-')[1]}&apikey=MVMTWELWDVXO1DXO`)
      .then(response => { exchangeRatesMap[currencyPair] = response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']; })
  });

}, 30 * 1000);

@Injectable()
export class AppService {


  private supportedPairs: Set<string> = new Set(['USD-EUR', 'USD-GBP', 'EUR-USD', 'EUR-GBP', 'GBP-USD', 'GBP-EUR']);

  async getExchangeRates(): Promise<{ [key: string]: { rate: number, expiryAt: string } }> {
    const currentTime = Math.floor(Date.now() / 1000);
    const exchangeRates: { [key: string]: { rate: number, expiryAt: string } } = {};

    // Iterate over supported currency pairs and fetch exchange rates
    for (const currencyPair of this.supportedPairs) {
      try {
        // Checked if the exchange rate is already in the map and not expired
        if (exchangeRatesMap.has(currencyPair)) {
          const { rate, expiryAt } = exchangeRatesMap.get(currencyPair);
          if (expiryAt > currentTime) {
            const formattedExpiryAt = new Date(expiryAt * 1000).toLocaleString(); // Converted  timestamp to a human-readable format
            exchangeRates[currencyPair] = { rate, expiryAt: formattedExpiryAt };
            continue;
          }
        }

        // Fetch the exchange rate from the API
        const response = await axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currencyPair.split('-')[0]}&to_currency=${currencyPair.split('-')[1]}&apikey=MVMTWELWDVXO1DXO`);
        //  console.log(response.data,"Deepak");
        // Extracted the exchange rate and expiration time from the response
        const exchangeRate = response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
        const expiryAt = currentTime + 30 * 1000; // Assuming the exchange rate is valid for 30 seconds

        // Stored the exchange rate and expiration time in the map
        exchangeRatesMap.set(currencyPair, { rate: parseFloat(exchangeRate), expiryAt });

        const formattedExpiryAt = new Date(expiryAt * 1000).toLocaleString(); // Converted  timestamp to a human-readable format
        exchangeRates[currencyPair] = { rate: parseFloat(exchangeRate), expiryAt: formattedExpiryAt };
      } catch (error) {
        console.error(`Error fetching exchange rate for ${currencyPair}:`, error.message);
        // Handled the error gracefully, such as setting a default rate or skipping this currency pair

      }
    }

    return exchangeRates;
  }
}

@Injectable()
export class AccountService {
  private balances: {
    [key: string]: { [key: string]: number }
  } = {};
  topUp(topUpDto: AccountDtO, id: string) {
    const { currency, amount } = topUpDto;
    if (amount <= 0) {
      throw new Error('Invalid amount: Amount must be greater than zero');
    }
    if (!this.balances[id]) this.balances[id] = {};
    if (!this.balances[id][currency]) this.balances[id][currency] = 0
    this.balances[id][currency] += amount;
  }
  getBalance(id: string) {
    // console.log(this.balances[id],"Deepak");
    return { balances: this.balances[id] };
  }
}



@Injectable()
export class FxConversionService {
  constructor(private readonly appService: AppService) { }

  async performConversion(conversionDto: FxConversionDto): Promise<{ convertedAmount: number, currency: string }> {
    const { fromCurrency, toCurrency, amount } = conversionDto;

    // Constructed the currency pair key
    const currencyPair = `${fromCurrency}-${toCurrency}`;
    const currencyPairExists = exchangeRatesMap.has(currencyPair);
    let exchangeRated;
    if (currencyPairExists) {
      // Currency pair is present in the map
      const { rate, expiryAt } = exchangeRatesMap.get(currencyPair);
      exchangeRated = amount * rate;
      console.log(`${currencyPair} exists in the exchange rates map.`);


    } else {
      // Currency pair is not present in the map

      const response = await axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currencyPair.split('-')[0]}&to_currency=${currencyPair.split('-')[1]}&apikey=MVMTWELWDVXO1DXO`);
      const exchangeRate = response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
      if (!exchangeRate) {
        throw new Error('something went wrong');
      }
      const currentTime = Math.floor(Date.now() / 1000);
      const expiryAt = currentTime + 30 * 1000; // Assuming the exchange rate is valid for 30 seconds

      // Store the exchange rate and expiration time in the map
      exchangeRatesMap.set(currencyPair, { rate: parseFloat(exchangeRate), expiryAt });
      exchangeRated = amount * parseFloat(exchangeRate);

    }
    // Retrieve exchange rate from AppService




    // Default to 1:1 conversion if rate not found

    // Perform the conversion
    if (exchangeRated == undefined) {
      throw new Error('Invalid currency pair or amount provided. Please check the currency pair and try again.or may Be Currency Pair Not Found in the API');
    }
    const convertedAmount = exchangeRated * amount;
    //  console.log(convertedAmount,"Deepak",exchangeRated,amount);

    return { convertedAmount, currency: toCurrency };
  }
}