class CameraControl
{
    constructor()
    {
        var self = this;
        this.keyList = {};
        $(document).keydown((e)=>{self.OnKeyDown(e)});
        $(document).keyup((e)=>{self.OnKeyUp(e)});
        $(document).scroll(function (e) {
            e.preventDefault();

        });
    }

    OnKeyDown(e)
    {
        this.SetKey(this.KeyNormalizer(e.keyCode), true);
    }

    OnKeyUp(e)
    {
        this.SetKey(this.KeyNormalizer(e.keyCode), false);
    }

    SetKey(key, isPressed)
    {
        //only take valid outputs from keyNormalizer
        if(key != null)
        {
            this.keyList[key] = isPressed;
        }
    }

    GetKey(key)
    {
        return this.keyList[key];
    }

    KeyNormalizer(key)
    {
        switch(key)
        {
            //In case of up or W
            case 38:
            case 87:
                return "up";
            //In case of left or A
            case 37:
            case 65:
                return "left";
            //In case of right or D
            case 39:
            case 68:
                return "right";
            //In case of down or S
            case 40:
            case 83:
                return "down";
            //In case of plus or num plus
            case 107:
            case 187:
                return "plus";
            //In case of minus or num minus
            case 109:
            case 189:
                return "minus";
            //In case none of the above return null
            default:
                return null;
        }
    }
}
