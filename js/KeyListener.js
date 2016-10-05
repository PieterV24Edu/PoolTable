$(document).ready(function () {
    $(document).keydown(function (e) {
        console.log(e.keyCode);
    });
});

function KeyNormalizer(key)
{
    switch(key)
    {
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