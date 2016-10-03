class Renderer
{
    constructor()
    {
        this.OnRenderEvent = new Event('onrenderupdate');
        this.clock = new THREE.Clock();
        this.clock.start();
        this.DeltaTime = 0;
        this.CreateScene();
        this.Render();
    }

    CreateScene()
    {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.camera.position.z = 15;
    }
    Render()
    {
        requestAnimationFrame(this.Render);
        this.DeltaTime = this.clock.getDelta();
        document.dispatchEvent(this.OnRenderEvent);
        this.renderer.render(this.scene, this.camera);
    }
    AddObject(mesh)
    {
        this.scene.add(mesh);
    }
}
