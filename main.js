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

const by_silt_strider = {
    "Ald'ruhn" : {"Balmora" : 4, "Gnisis" : 4, "Khuul" : 5, "Maar Gan" : 2},
    "Balmora" :	{"Ald'ruhn" : 4, "Seyda Neen" : 3, "Suran" : 5, "Vivec" : 4},
    "Gnisis" : {"Ald'ruhn" : 4, "Khuul" : 3, "Maar Gan" : 4, "Seyda Neen" : 11},
    "Khuul" : {"Ald'ruhn" : 5, "Gnisis" : 3, "Maar Gan" : 3},
    "Maar Gan" : {"Ald'ruhn" : 2, "Gnisis" : 4, "Khuul" : 3},
    "Molag Mar" : {"Suran" : 3, "Vivec" : 4},
    "Seyda Neen" : {"Balmora" : 3, "Gnisis" : 11, "Suran" : 4, "Vivec" : 2},
    "Suran" : {"Balmora" : 4, "Molag Mar" : 3, "Seyda Neen" : 4, "Vivec" : 1},
    "Vivec" : {"Balmora" : 4, "Molag Mar" : 4, "Seyda Neen" : 2, "Suran" : 1}
};

const by_guide = {
    "Ald'ruhn":	{"Balmora" : 0, "Caldera" : 0, "Sadrith Mora" : 0, "Vivec" : 0},
    "Balmora":{"Ald'ruhn": 0, "Caldera" : 0, "Sadrith Mora" : 0, "Vivec" : 0},
    "Caldera": {"Ald'ruhn": 0, "Balmora" : 0, "Sadrith Mora" : 0, "Vivec" : 0},
    "Sadrith Mora" : {"Ald'ruhn": 0, "Balmora" : 0, "Caldera" : 0, "Vivec" : 0},
    "Vivec" : {"Ald'ruhn": 0, "Balmora" : 0, "Caldera" : 0, "Sadrith Mora" : 0},
};

function dijkstra(graphs, start, use_weight) {
    let distances = {};
    let predecessors = {};
    let visited = new Set();
    var nodes_set = new Set();
    for (let [method, graph] of Object.entries(graphs)) {
        for (const node of Object.keys(graph)) {
            nodes_set.add(node);
        }
    }
    let nodes = [...nodes_set];

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

        for (let [method, graph] of Object.entries(graphs)) {
            for (let neighbor in graph[closest]) {
                if (visited.has(neighbor))
                    continue;
                let distance = graph[closest][neighbor];
                let weight = use_weight ? distance : 1;
                let new_distance = distances[closest] + weight;
                if (new_distance < distances[neighbor]) {
                    distances[neighbor] = new_distance;
                    predecessors[neighbor] = {place: closest, method: method, time: distance};
                }
            }
        }
    }

    return [distances, predecessors];
}

function get_route() {
    var src_choice = document.getElementById("src-choice").value;
    var dst_choice = document.getElementById("dst-choice").value;
    var use_weight = document.getElementById("time").checked;

    routes = {"Boat" : by_boat, "Silt Strider": by_silt_strider, "Guild Guide": by_guide};

    [distances, preds] = dijkstra(routes, src_choice, use_weight);

    route = []
    total = 0
    for (let cur = {place: dst_choice, method: null}; cur != null; cur = preds[cur.place]) {
        if (cur.method != null) {
            route.push(cur.method + " (" + cur.time + "h)");
            total += cur.time;
        }
        route.push("<b>" + cur.place + "</b>");
    }

    var itinerary =document.getElementById("itinerary");
    itinerary.innerHTML = '';
    var route_list = document.createElement('ul');
    for (const place of route.reverse()) {
        var option = document.createElement('li');
        option.innerHTML = place;
        route_list.appendChild(option);
    }
    h2 = document.createElement('h2');
    h2.innerHTML = "Itinerary";
    total_text = document.createTextNode("Total: " + total + "h")
    itinerary.appendChild(h2);
    itinerary.appendChild(route_list);
    itinerary.appendChild(total_text);
}

function main() {
    var src = document.getElementById("src");
    var dst = document.getElementById("dst");

    places = new Set();
    for (const place of Object.keys(by_boat))
        places.add(place);

    for (const place of Object.keys(by_silt_strider))
        places.add(place);

    for (const place of Object.keys(by_guide))
        places.add(place);

    for (const place of [...places].sort()) {
        console.log(src);
        {
            var option = document.createElement('option');
            option.value = place;
            src.appendChild(option);
        }
        {
            var option = document.createElement('option');
            option.value = place;
            dst.appendChild(option);
        }
    }
}
