class Hole
{
    constructor(x, z, name)
    {
        this.name = name;
        this.Radius = 5;
        this.OnFoulEvent = new Event("onFoul");
        //this.HoleMat = new THREE.MeshLambertMaterial({color: 0xFF0000, });
        this.HoleMat = new THREE.MeshDepthMaterial({wireframe: true});
        this.HoleGeo = new THREE.SphereGeometry(this.Radius, 10, 10);
        this.HoleMesh = new THREE.Mesh(this.HoleGeo, this.HoleMat);
        this.HoleMesh.receiveShadow = true;
        this.HoleMesh.castShadow = true;

        this.HoleMesh.position.set(x, 0, z);
    }

    CheckBall(ball)
    {
        var distance = this.HoleMesh.position.distanceTo(ball.position);
        if(distance < ball.Radius + this.Radius)
        {
            if(ball.name == 8 || ball.name == 0)
            {
                ball.ResetPos();
                document.dispatchEvent(this.OnFoulEvent);
                return null;
            }
            else
                ball.inScene = false;
            return ball;
        }
        return null;
    }

    get mesh()
    {
        return this.HoleMesh;
    }
}