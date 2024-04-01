
import fetch from "node-fetch";
import config from '../config/config.json';
type Token = {
    id: string,
    rank: string,
    symbol: string,
    name: string,
    maxSupply: string,
    marketCapUsd: string,
    volumeUsd24Hr: string,
    priceUsd: string,
    changePercent24Hr: string,
    vwap24Hr: string,
    explorer: string,
};
type PriceData = {
    priceUsd: string,
    time: number,
    circulatingSupply: string,
    date: string,
}

type AssetsResponse = {
    data: Token[],
    timestamp: Int16Array
};

type PriceResponse = {
    data: PriceData[],
    timestamp: Int16Array
};
export default class CoinsProcess {
    
    /**
     * Get the coincap id of a token using its symbol
     * @param symbol symbol of the coins
     * @returns coin of the coincap id
     */
    public static async GetIdBySymbol(symbol: string): Promise<string>{
        
        let tokenId: string = "";

        if (symbol)
            // Request all
            await fetch(`${config.coincap_host}/v2/assets`)
                .then(async (res) => {
                    try {

                        const responseBody: AssetsResponse = await res.json(); 
                        const token = responseBody.data.find(t => t.symbol === symbol);
                        if (token)
                            tokenId = token.id;
                    } catch (err) {

                        console.error(err);
                        return null;
                    }
                }
            ).
                catch(err => {
                    console.error(err);
                    return null;
                })
        return tokenId
        
    }
    /**
     * Get the history of a token
     * @param tokenId 
     * @returns 
     */
    public static async  GetHistory(tokenId : string) : Promise<PriceData[]>{
        
        let result: PriceData[] = [];

        if (tokenId) {
            
            const dateStart = new Date(new Date().getTime() - (14 * 24 * 60 * 60 * 1000));
            // Request all
            await fetch(`${config.coincap_host}/v2/assets/${tokenId}/history?interval=h1&start=${dateStart.getTime()}&end=${new Date().getTime()}`)
                .then(async (res) => {
                    try {

                        const responseBody: PriceResponse = await res.json();
                        result = responseBody.data;
                    } catch (err) {

                        console.error(err);
                        return null;
                    }
                }
                ).
                catch(err => {
                    console.error(err);
                    return null;
                });
        }
        return result
    }
}