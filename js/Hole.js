class Hole
{
    constructor(x, z, name)
    {
        this.name = name;
        this.Radius = 5;
        this.HoleMat = new THREE.MeshLambertMaterial({color: 0xFF0000});
        this.HoleGeo = new THREE.SphereGeometry(this.Radius, 32, 32);
        this.HoleMesh = new THREE.Mesh(this.HoleGeo, this.HoleMat);
        this.HoleMesh.receiveShadow = true;
        this.HoleMesh.castShadow = true;

        this.HoleMesh.position.set(x, 0, z);
    }

    CheckBall(ball)
    {
        var distance = this.HoleMesh.position.distanceTo(ball.position);
        if(distance < (ball.Radius + this.Radius))
            return ball.name;
        return null;
    }

    get mesh()
    {
        return this.HoleMesh;
    }
}