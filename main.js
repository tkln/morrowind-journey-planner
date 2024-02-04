document.addEventListener("DOMContentLoaded", main, false);

const by_boat = {
    "Dagon Fel" : {"Khuul" :  8, "Sadrith Mora" :  10, "Tel Aruhn" :  9, "Tel Mora" :  5},
    "Ebonheart" : {"Hla Oad" :  5, "Sadrith Mora" :  11, "Tel Branora" :  6, "Vivec" :  1, "Holamayan" :  9},
    "Gnaar Mok" : {"Hla Oad" :  4, "Khuul" :  7},
    "Hla Oad" : {"heart" : 5, "Gnaar Mok" : 4, "Molag Mar" : 10, "Vivec" : 5},
    "Holamayan" : {"Ebonheart" : 9},
    "Khuul" : {"Dagon Fel" : 8, "Gnaar Mok" : 7},
    "Molag Mar" : {"Hla Oad" : 10, "Tel Branora" : 2, "Vivec" : 4},
    "Sadrith Mora" : {"Ebonheart" : 11, "Dagon Fel" : 10, "Tel Branora" : 8, "Tel Mora" : 5},
    "Tel Aruhn" : {"Dagon Fel" : 9, "Tel Mora" : 4, "Vos" : 4},
    "Tel Branora" : {"Ebonheart" : 6, "Molag Mar" : 2, "Sadrith Mora" : 8, "Vivec" : 5},
    "Tel Mora" : {"Dagon Fel" : 5, "Sadrith Mora" : 5, "Tel Aruhn" : 4, "Vos" : 0},
    "Vivec" : {"Ebonheart" : 1, "Hla Oad" : 5, "Molag Mar" : 4, "Tel Branora" : 5},
    "Vos" : {"Sadrith Mora" : 5, "Tel Aruhn" : 4, "Tel Mora" : 0},
};

function dijkstra(graph, start) {
    let distances = {};
    let predecessors = {};
    let visited = new Set();
    let nodes = Object.keys(graph);
    for (let node of nodes) {
        distances[node] = Infinity;
        predecessors[node] = null;
    }

    distances[start] = 0;

    while (nodes.length) {
        nodes.sort((a, b) => distances[a] - distances[b]);
        let closest = nodes.shift();

        if (distances[closest] === Infinity)
            break; 

        visited.add(closest);

        for (let neighbor in graph[closest]) {
            if (visited.has(neighbor))
                continue;
            let new_distance = distances[closest] + graph[closest][neighbor];
            if (new_distance < distances[neighbor]) {
                distances[neighbor] = new_distance;
                predecessors[neighbor] = closest;
            }
        }
    }
    return [distances, predecessors];
}

function get_route() {
    var src_choice = document.getElementById("src-choice").value;
    var dst_choice = document.getElementById("dst-choice").value;
    console.log("Click");
    console.log(src_choice);
    [distances, preds] = dijkstra(by_boat, src_choice);
    console.log(distances);
    console.log(preds);
    route = []
    for (let cur = dst_choice; cur != null; cur = preds[cur]) {
        route.push(cur);
    }

    var route_list = document.getElementById("route");
    for (const place of route.reverse()) {
        var option = document.createElement('li');
        option.innerHTML = place;
        route_list.appendChild(option);
    }
}

function main() {
    var src_choice = document.getElementById("src");
    var dst_choice = document.getElementById("dst");
    for (const place of Object.keys(by_boat)) {
        console.log(src_choice);
        {
            var option = document.createElement('option');
            option.value = place;
            src_choice.appendChild(option);
        }
        {
            var option = document.createElement('option');
            option.value = place;
            dst_choice.appendChild(option);
        }
    }
}
