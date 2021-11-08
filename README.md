# Trading Dashboard

<img width="1903" alt="Screenshot 2021-11-01 at 18 28 41" src="https://user-images.githubusercontent.com/26247922/139714053-10b3f67e-ffcb-443e-aca4-41044c1d8537.png">

## Getting started

- Clone this repository.
- Check if you have Yarn installed, you can check by running `yarn -v`.
- Create a fresh new API on Binance, with only read rights.
- In the config folder, edit the `api-keys.example.js` into `api-keys.js` and put your new api key/secret.
- From the root, run `yarn install` (one single time)
- From the root, run `yarn run start`

Currently only Binance and Futures are supported.

## API weight usage

- Account: Fetching account information cost `5` weight
- Trades: The initial fetch cost `7 days * 8 chunks * 5 weight = 280 weight`. After the initial fetch, it will cost max `8 chunks * 5 weight = 40 weight / minute`
- Income: The initial fetch cost `7 days * 3 chunks * 30 weight = 630 weight`. After the initial fetch, it will cost max `3 chunks * 30 weight = 90 weight / minute`

- Total weight consumption: First load of the page `915 weight`, after that every minute your data is refreshed automatically and consumes `135 weight / minute`.
- Reminder: Binance API allows you to consume up to `1200 weight / minute / IP`.
