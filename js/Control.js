class Control
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

        //ColorChange CameraRotPad
        $(".cameraRotPad").mouseenter(function () {
            $(this).css("background-color", "#AAAAFF");
        });
        $(".cameraRotPad").mouseleave(function () {
            $(this).css("background-color", "#0000FF");
        });

        //ColorChange CeuRotPad
        $(".ceuRotPad").mouseenter(function () {
            $(this).css("background-color", "#FFAAAA");
        });
        $(".ceuRotPad").mouseleave(function () {
            $(this).css("background-color", "#FF0000");
        });

        //ColorChange CameraHeightPad
        $(".cameraHeightPad").mouseenter(function () {
            $(this).css("background-color", "#AAFFAA");
        });
        $(".cameraHeightPad").mouseleave(function () {
            $(this).css("background-color", "#00FF00");
        });

        //ColorChange shootbutton
        $("#shootButton").mouseenter(function () {
            $(this).css("background-color", "#FFAAAA");
        });
        $("#shootButton").mouseleave(function () {
            $(this).css("background-color", "#FF0000");
        });

        //ShootButton
        $("#shootButton").on("touchstart mousedown", function () {
            $(this).css("background-color", "#990000");
            self.SetKey("space", true);
        });
        $("#shootButton").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#FF0000");
            self.SetKey("space", false);
        });

        //Dpad1
        $("#dPad1").on("touchstart mousedown", function () {
            $(this).css("background-color", "#000099");
            self.SetKey("a", true);
        });
        $("#dPad1").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#0000FF");
            self.SetKey("a", false);
        });

        //Dpad2
        $("#dPad2").on("touchstart mousedown", function () {
            $(this).css("background-color", "#000099");
            self.SetKey("d", true);
        });
        $("#dPad2").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#0000FF");
            self.SetKey("d", false);

        });

        //Dpad3
        $("#dPad3").on("touchstart mousedown", function () {
            $(this).css("background-color", "#990000");
            self.SetKey("left", true);
        });
        $("#dPad3").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#FF0000");
            self.SetKey("left", false);
        });

        //Dpad4
        $("#dPad4").on("touchstart mousedown", function () {
            $(this).css("background-color", "#990000");
            self.SetKey("right", true);
        });
        $("#dPad4").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#FF0000");
            self.SetKey("right", false);
        });

        //Dpad5
        $("#dPad5").on("touchstart mousedown", function () {
            $(this).css("background-color", "#009900");
            self.SetKey("up", true);
        });
        $("#dPad5").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#00FF00");
            self.SetKey("up", false);
        });

        //Dpad6
        $("#dPad6").on("touchstart mousedown", function () {
            $(this).css("background-color", "#009900");
            self.SetKey("down", true);
        });
        $("#dPad6").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#00FF00");
            self.SetKey("down", false);
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
            //In case of space
            case 32:
                return "space";
            //In case of up
            case 38:
                return "up";
            //In case of left
            case 37:
                return "left";
            //In case of right
            case 39:
                return "right";
            //In case of down
            case 40:
                return "down";
            //In case of a
            case 65:
                return "a";
            //In case of d
            case 68:
                return "d";
            //In case none of the above return null
            default:
                return null;
        }
    }
}
