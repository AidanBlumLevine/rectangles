import seedrandom from 'seedrandom'
export default class Random{
    constructor(seed: string){
        
    }
    normal(mean: number, standardDeviation: number, pos: boolean): number {
        var u = 0, v = 0;
        while (u === 0) u = Math.random(); // 0 not inclusive
        while (v === 0) v = Math.random();
        var range1_0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        if (pos) {
            return Math.abs(range1_0 * standardDeviation + mean);
        }
        return range1_0 * standardDeviation + mean;
    }
}