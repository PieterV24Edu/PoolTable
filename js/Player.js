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

    AddBall(ball)
    {
        this.PuttedBalls.push(ball);
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