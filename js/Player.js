class Player
{
    constructor(name, id)
    {
        this.Name = name;
        this.BallType = 0;
        this.OwnBallsPut = 0;
        this.ID = id;
        this.PuttedBalls = [];
    }

    BallsPut(nr)
    {
        this.OwnBallsPut += nr;
    }

    ClearBalls()
    {
        this.PuttedBalls = [];
    }

    get Score()
    {
        return this.OwnBallsPut;
    }
}