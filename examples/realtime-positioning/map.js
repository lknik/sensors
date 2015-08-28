function map(element_id, info_box_id, token) {
    var marker = null;
    var map = null;
    L.mapbox.accessToken = token;
    var updateInfoBox = infoBox(info_box_id);
    return function updateMap(err, coords) {
        updateInfoBox(err, coords);
        if (err) {
            if (marker) {
                marker.setStyle({ color: "#999" });
            }
        } else {
            if (map) {
                map.panTo(coords);
            } else {
                map = L.mapbox.map(element_id, 'mapbox.streets').setView(coords, 18);
            }
            if (marker) {
                marker.setLatLng(coords);
            } else {
                marker = L.circleMarker(coords)
                map.addLayer(marker);
            }
            marker.setStyle({ color: "#03f" });
        }
    };
}

function infoBox(element_id) {
    var update_count = 0;
    var last_updated;
    
    function updateInfoBox(err, coords) {
        last_updated = Date.now();
        update_count++;
        var lines = [];
        lines.push("Lat: " + (coords ? coords[0] : "…"));
        lines.push("Lng: " + (coords ? coords[1] : "…"));
        lines.push(err ? "Error: " + err.message : "");
        lines.push("Last update: <span id=last_update>" + displayTimeInterval() + "</span> ago");
        lines.push("Update count: " + update_count);
        lines.push("<a style='float: right;' href=''>refresh</a>");
        document.getElementById(element_id).innerHTML = lines.join("<br>");
    }
    
    function updateTimer() {
        if (last_updated) {
            document.getElementById("last_update").innerHTML = displayTimeInterval(Date.now() - last_updated);
        }
        requestAnimationFrame(updateTimer);
    }

    function displayTimeInterval() {
        var delta = Date.now() - last_updated
        return Math.floor(delta / 1000) + "." + pad(3, delta % 1000) + "s";
    }

    function pad(length, n) {
        n = n + "";
        while(n.length < length) {
            n = "0" + n;
        }
        return n;
    }

    updateTimer();
    return updateInfoBox;
}

var updateMap = map('map', 'info_box', 'pk.eyJ1IjoidG9iaWUiLCJhIjoiZDM5NDhkZWFkYjRjNTRlZTc4M2M0NDQ3ZmViMjgwNDUifQ.mtE579d9kCr58yG0sfx7vA');