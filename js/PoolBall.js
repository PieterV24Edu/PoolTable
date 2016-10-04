class PoolBall extends Ball
{
    constructor(name, type)
    {
        super(name);
        this.Type = type;
    }

    get type()
    {
        return this.Type;
    }
}