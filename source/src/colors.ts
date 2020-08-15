export default new class Colors{
    colors: string[] = [];
    constructor(){
        this.colors.push("#173F5F");
        this.colors.push("#20639B");
        this.colors.push("#3CAEA3");
        this.colors.push("#F6D55C");
        this.colors.push("#ED553B");
        this.colors.push("#F8F5EC");
    }
    getColor(): string{
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
}