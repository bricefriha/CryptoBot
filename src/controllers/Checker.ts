export default new class Checker {
    
    // List or all the crypto symbols that need to be checked
    private _symbols : Array<string>;
    public get Symbols() : Array<string> {
        return this._symbols;
    }
    

    constructor() {
        // All the crypto symbols that need to be checked
        this._symbols = [
            'solana',
            'DOGE',
            'AXS',
            'SHIBE',
            'LUNA'
        ]
    }
    /**
     * Run
     */
    public Run() {
        // Loop symbols
        for (const Symbol in this.Symbols) {
            
            // Get the information about them
        }
    }
    
}