/* Vi vil vise én måned av gangen, og for hver av dagene vil vi visualisere
temperaturdataene med et vertikalt, ganske tett søylediagram, hvor høyden
på hver søyle korresponderer med temperaturen hver time på dagen. I tillegg
vil vi at hver søyle skal få farge som psykologisk matcher temperaturen,
fra blått for de aller laveste gradene, via grønn- og gulnyanser til
oransje, og rødt for de aller høyeste temperaturene. Vi vil også vise maks.
og min. temp som tall for hver dag. For at diagrammene skal bli mer
leselige legger vi dem inn i en liten koordinat grid. */

// grunnleggende svg bygging:
function newSVGel(element) {
    return document.createElementNS("http://www.w3.org/2000/svg", element);
}

// lage svg ramme:
function basicSVGframe(wide, high) {
    let frame = newSVGel("svg");
    let box = "0 0 " + wide + " " + high;
    frame.setAttribute("width", wide);
    frame.setAttribute("height", high);
    frame.setAttribute("viewbox", box);
    return frame;
}

// funksjon for å lage én søyle. Tar temperatur og x posisjon som argument:
function makeBar(temp, posX) {
    let bar = newSVGel("rect");
    let posY = String(110 - (temp*3));
    let high = String(Math.round((temp + 10)*3));
    let farge = rgbTemp(temp);
    bar.setAttribute("width", "4");
    bar.setAttribute("height", high);
    bar.setAttribute("y", posY);
    bar.setAttribute("x", posX);
    bar.style.fill = farge;
    return bar;
}

// funksjon for å regne temperatur mellom -10 og 30 til ønskede rgb verdier:
function rgbTemp(temperatur) {
    let temp = parseFloat(temperatur);
    let r="0";
    let g="0";
    let b="0";
    let red = Math.floor(temp*15 - 15);
    if (red<0) {
        r="0";
    }
    else if(red>255) {
        r="255";
    }
    else {
        r=String(red);
    }
    let green = Math.floor(255-((temp-13)*0.87)**2);
    if (green<0) {
        g="0";
    }
    else {
        g=String(green);
    }
    let blue = Math.floor(temp*(-13) + 140);
    if (blue<0) {
        b="0";
    }
    else if(blue>255) {
        b="255";
    }
    else {
        b=String(blue);
    }
    return "rgb(" + r + "," + g + "," + b + ")";
}

// lager en enkeltlinje til bruk i grid:
function blackLine(x1, x2, y1, y2) {
    let line = newSVGel("line");
    line.setAttribute("x1", x1);
    line.setAttribute("x2", x2);
    line.setAttribute("y1", y1);
    line.setAttribute("y2", y2);
    line.style.stroke = "rgba(0,0,0,0.27)";
    line.style.strokeWidth = "1px";
    return line;
}

// lager lysere linje til bruk i grid:
function lightLine(x1, x2, y1, y2) {
    let line = newSVGel("line");
    line.setAttribute("x1", x1);
    line.setAttribute("x2", x2);
    line.setAttribute("y1", y1);
    line.setAttribute("y2", y2);
    line.style.stroke = "rgba(0,0,0,0.08)";
    line.style.strokeWidth = "1px";
    return line;
}

// funksjon for å sette opp koordinat grid m temperatur og timer:
function makeGrid() {
    let grid = newSVGel("g");
    let h1 = blackLine("17", "164", "20", "20");
    let h2 = blackLine("17", "164", "50", "50");
    let h3 = blackLine("17", "164", "80", "80");
    let h4 = blackLine("17", "164", "110", "110");
    let h5 = blackLine("17", "164", "140", "140");
    let hl1 = lightLine("20", "164", "35", "35");
    let hl2 = lightLine("20", "164", "65", "65");
    let hl3 = lightLine("20", "164", "95", "95");
    let hl4 = lightLine("20", "164", "125", "125");
    let v1 = blackLine("20", "20", "17", "140");
    let v2 = blackLine("44", "44", "17", "140");
    let v3 = blackLine("68", "68", "17", "140");
    let v4 = blackLine("92", "92", "17", "140");
    let v5 = blackLine("116", "116", "17", "140");
    let v6 = blackLine("140", "140", "17", "140");
    let v7 = blackLine("164", "164", "17", "140");
    let tmp1 = gridTxt("30", "gridTxt1", "6", "23");
    let tmp2 = gridTxt("20", "gridTxt1", "6", "53");
    let tmp3 = gridTxt("10", "gridTxt1", "6", "83");
    let tmp4 = gridTxt("0", "gridTxt1", "11", "113");
    let tmp5 = gridTxt("-10", "gridTxt1", "3", "143");
    let hr2 = gridTxt("6", "gridTxt1", "41", "150");
    let hr3 = gridTxt("12", "gridTxt1", "62", "150");
    let hr4 = gridTxt("18", "gridTxt1", "86", "150");
    let hr5 = gridTxt("24", "gridTxt1", "110", "150");
    let hr6 = gridTxt("30", "gridTxt1", "134", "150");
    let hr7 = gridTxt("36", "gridTxt1", "158", "150");
    let elems = [h1, h2, h3, h4, h5, hl1, hl2, hl3, hl4, v1, v2, v3, v4, v5, v6, v7, tmp1, tmp2, tmp3, tmp4, tmp5, hr2, hr3, hr4, hr5, hr6, hr7];
    for(var i of elems) {
        grid.append(i);
    }
    return grid;
}

// funksjon for lage tekst til grid. Tar bl.a. tekstinnhold og css klasse som arg.
function gridTxt(name, classNam, posX, posY) {
    let txt = newSVGel("text");
    txt.setAttribute("x", posX);
    txt.setAttribute("y", posY);
    txt.setAttribute("class", classNam);
    txt.textContent = name;
    return txt;
}

// regne ut maks temp fra en dag (tar en array)
function maxTemp(temps) {
    let max = Math.max.apply(null, temps);
    let maxTxt = "Max: " + String(max.toFixed(1));
    let maxT = gridTxt(maxTxt, "gridTxt2", "32", "11");
    return maxT;
}

// samme for min temp
function minTemp(temps) {
    let min = Math.min.apply(null, temps);
    let minTxt = "Min: " + String(min.toFixed(1));
    let minT = gridTxt(minTxt, "gridTxt2", "104", "11");

    return minT;
}

// funksjon som tar temp data fra en dag (en array), og setter sammen et søylediagram vha de andre funksjonene:
function diagram(listSlice) {
    let dia = newSVGel("g");
    for (let i in listSlice) {
        let posX = i*4 + 20;
        let temp = parseFloat(listSlice[i])
        let bar = makeBar(temp, posX);
        dia.append(bar);
    }
    return dia;
}

/* denne funksjonen tar et månedssett med temperaturer (1080 verdier), deler det
i 36 slices, og bygger opp hele kalenderen i 36 div elementer, som legges til i
html dokumentet i et element m id "monthTest" */
function makeMyDays(tempArr) {
    let month = document.getElementById("monthTest");
    month.innerHTML = "";
    for (let d = 0; d<30; d++) {
        let slice = tempArr.slice(d*36, d*36+36);
        let day = document.createElement("div");
        let date = document.createElement("div");
        date.setAttribute("class", "tall");
        date.innerText = d+1;
        day.setAttribute("class", "grid-item");
        let box = basicSVGframe("172", "155");
        let dia = diagram(slice);
        let grid = makeGrid();
        let max = maxTemp(slice);
        let min = minTemp(slice);
        box.append(dia);
        box.append(grid);
        box.append(max);
        box.append(min);
        day.append(date);
        day.append(box);
        month.append(day);
    }
}

/* fetcher et månedssett m temperaturer, basert på verdier for måned og år
hentet fra bruker input i html dokumentet, og kjører kalenderbyggefunksjonen
med det fetchede verdisettet. Denne fungerer dessverre ikke etter at UiB tok ned trialmix. 

function fetchMonth() {
    let year = document.getElementById("aar").value;
    let month = document.getElementById("mnd").value;
    let url = "https://trialmix.infomedia.uib.no/andregrader/1111/" + year + "/" + month +"/";
    fetch(url)
        .then(raw => raw.text())
        .then(txt => txt.split("\n"))
        .then(makeMyDays);
}
*/

/* Følgende funksjon setter i stedet inn testdata for en måned */
function testMonth() {
    let testTemps = [-3.1,-3.7,-1.3,-3.2,-0.5,-2.7,-1.4,1.4,2,2.9,3.8,4.2,3.9,5.5,3.8,6.6,5.3,6.6,7.5,4.9,7.6,8.7,7.8,7,7.5,6.5,6.3,5.4,3,4.9,0.4,0,0.8,0.2,-2.2,-0.4,-0.2,-1.4,1.5,0.6,1.4,2.8,2.6,-0.2,2.7,0.9,2.6,4.3,4,5,7.5,5.5,8.8,7.8,8.1,7.1,9.4,8.8,10.5,9.9,8.5,10.2,8,6.4,6.3,6.6,3.5,2.4,1.3,3.5,2.8,0.8,-1.2,-2,-1.5,-0.7,0.7,3.4,5,3.7,4.5,2.9,6,5.6,5.6,6.6,9.5,9.6,10.6,9.5,11.8,11.3,13.2,10.9,12.9,11.6,13.3,10.7,10.5,8.7,8.9,7.7,7.9,4.9,5.3,1.3,0.6,-0.3,0.1,-1.3,0.4,1.3,3,3.1,2.2,0.6,2.6,2.6,4.3,6.4,7.6,8.7,12,11.6,12.2,13.7,14,11.9,13.9,12.8,15,15.2,11.8,12.2,9,9.2,7.1,6.2,4.4,4.4,4.9,4.5,4.9,5.3,0.5,0.8,0.8,3.8,2.7,4.3,4.3,4.5,5.9,5.9,8.2,12.7,13.6,14.4,13.9,13.7,15.1,15.9,14.9,13.6,17,17.3,18,20.8,20,18.6,15.4,15.3,11.8,12.6,10.8,10,7.4,8.9,6.8,5.8,7.1,4.8,7.6,7,8.7,10.2,11.7,11.7,11.7,12.9,14.3,14.3,16.5,18.2,18.5,19.5,18.3,20.4,21.3,21.8,21.8,23.9,23.8,23.1,23.9,19.9,20,18.9,17.2,17.1,15.1,13.8,12.6,9.3,10.7,8.9,6.6,7.8,7.1,7.5,7.2,10,7.9,14,13.9,15,15.8,14.2,17.3,17.3,17.4,18.1,19,21.7,22,23.5,25.5,25.2,26.9,20.8,20.9,19.2,18.6,16.1,15.9,15.6,16.4,15,11.9,12.6,10.5,8.7,7,8.3,7.6,9.7,10.8,8.8,10.2,10,11.2,12.8,12.5,13.4,15.6,15.8,16.6,16.7,17.8,20.4,21.1,21.9,22.3,22.4,24.4,21.9,20.3,18.7,18.3,15.3,13.6,14.8,13,11,9.8,11,8.4,6.7,6.9,7.2,7.4,8.4,8.9,9.6,8.9,10.6,9.5,11.3,16,15.5,16.8,18.8,15.9,16.8,17.9,20,20.6,22.9,23.3,23,25.2,22.2,20.5,19.6,18.5,18,16.5,15.9,13.9,12.1,9.2,8.1,7.9,4.1,6.4,4.1,5.2,5.9,7.8,8.7,10.3,8.8,10.5,10.4,11.3,13.8,15.7,17.3,17.6,15.2,17,18.7,19.8,22.7,21.7,23.7,22.7,23.1,22.7,19.5,19,17.3,15.8,16.2,13.4,12.6,11.5,12,11.7,9.7,7.9,5.6,5.6,7.4,10.7,11.4,13.2,14.4,14.3,15.9,12.7,14.5,15.1,17,16.5,16.9,18.2,21,21.3,22,24.2,24.7,24.4,24.1,23.3,22.3,19.3,19.1,16.3,14.3,13.4,11.6,12.1,12.1,10.1,10.6,7.1,5.3,7,9,10.2,12.3,11.8,13.2,12.1,13.4,14.2,16.9,15.5,16.6,19.1,19.4,18.9,22.7,20.9,21.1,21.7,23.1,26,25.1,24.1,22.1,19.3,17.9,15,16.4,14.3,11.8,9.1,11.2,9.3,9.6,9,6.4,7.6,9.5,7.7,8.2,10.1,12.2,10.6,13.8,13.6,16.7,16.9,18.5,21.1,20,22.6,23.8,22,23.7,25.4,26.2,26.6,23.3,22.5,21.4,19.4,19,17.5,15.3,13.4,13.9,12.7,11.1,11.6,8.8,5.3,5.6,7,7.9,6.6,8.3,8.8,12.5,10.8,13.8,14.5,15.4,18.8,19.3,17,17.1,19.7,20.6,22.9,25.2,24.3,26.9,26.6,24.7,23.1,21.2,20.5,16.4,16.3,15.4,13.3,12.7,10.1,12.1,7.9,9.4,8.2,8.6,9.3,9.4,9,9,11.3,13.4,11.6,12.7,15.1,16.4,17.1,17,18.2,17.1,18.5,19.9,22.9,22,24.4,24.3,26.2,28.1,24.8,24.7,20.2,19.4,16.2,15.1,15,13.2,9.7,12.4,9.6,8.2,7.3,5.9,8.3,9.7,10.7,8.8,9.5,10.2,11.1,12.2,14.7,15.1,16.4,17.4,17.8,20,19.2,23,24.1,23.6,25.4,26.8,27.6,25.4,24.4,19.9,21.1,19.9,17.9,17.3,14.8,13.5,12.7,10.4,7.9,9.6,6,5.9,7,9.1,9.8,12.1,13.1,14,12.9,15.2,16.1,18.1,17.6,20.6,19.7,23,23.7,24.6,24.2,25.7,29.4,28.1,31.2,28.5,25.4,23.9,20.3,19.3,18.6,18.6,16.1,13,14.7,11.7,9.8,10.6,9.8,10.1,12,10.2,10.8,10.3,13.8,12.1,14,14.1,17.1,17.9,20.3,19.4,22.8,23.6,25,24.6,27.5,26.5,28.5,30,29,28.3,25,23.9,21.9,20.1,19.9,17.8,15.6,12.8,11.8,12.1,10.2,10.4,9.2,9.5,10.3,9.7,10,11.7,13,12.8,13.3,14,15.8,17.8,18.1,19.6,23,21.5,23.8,23.6,25.6,26.7,28.2,28.1,28.9,29.2,27.2,26.9,22.6,20.4,19.3,16.3,15.1,12.7,13.4,10.9,11,7.3,11,11.1,10.7,13,13.1,14,14.9,15.1,15.3,17.8,18.8,18.6,20.7,22.7,21.9,24.3,26.3,24.9,27.7,28.5,29.2,29.1,31.4,29.2,26.2,26.7,23.2,23.1,22.2,20.2,18.9,16,16,15.3,13,13.2,12,12.2,11.5,13.9,12.8,13.5,12,15,15.1,19,16.9,19.5,20.1,22.4,22.7,24.6,26.2,25.3,27.7,26.9,27.5,28.3,31.2,31.8,29.7,26.4,25.5,21,22.5,18.9,18.1,18.4,17.6,15,13.7,11.3,10.4,10.6,10.9,10.8,11.7,13.5,13,16.7,18.1,16.7,19.4,18.3,22.1,21.4,23.2,22.9,24.5,25.2,26.7,29.7,29.2,31.2,33.3,31.8,30.4,26.7,26,23,21.9,20,19.5,16.6,16.8,16.3,14.6,11.6,10.5,9.4,10.9,13.9,15.5,15.3,14.7,15.9,19.6,19.4,18.4,21.3,20,22.3,22,22.9,24.8,27.8,27.8,28.7,28.6,31.6,30.5,28.9,27.6,26,23.9,22.5,21.5,20.4,18,16.6,15.2,14.5,11.3,9.5,9,10,11.2,10,14.1,13,14,15.2,17,18.2,19.2,19.6,19.7,22.8,23.2,22.8,23.7,25.7,27,27.8,28.6,30.6,30.2,29.6,28.3,25.9,25.4,22.7,22,21,18.4,14.6,13.1,14.9,12.2,10.5,12.5,11.7,10.8,12.3,14,13.2,15.1,13.7,16.5,15.8,17.9,19.2,21.6,21.1,23,24.4,24.9,25.7,25.9,28.2,31.1,31.7,32.2,31.9,28.9,28.7,25.9,24.5,23.2,20.2,20.1,15.8,15.3,14.4,13.5,10.9,10.5,9.1,9.9,11.9,13.2,12.3,14.7,16.2,17.9,16.7,20.4,21.2,22.8,21.4,22,24.5,25.7,26.3,26.7,28.3,29.3,31.9,31.8,31.6,29.6,27.5,25.6,22,20.4,20,18.8,16.1,15.6,14.3,11.8,12.6,8.4,9.7,9.5,9.6,11.3,12.4,12.3,15,15.9,15.5,18.4,17.9,18.8,21.8,23.6,24.5,23.3,26.6,27.6,29.3,28.6,28.9,31.1,31.3,30.6,26.6,22.8,22.1,21,19.3,16.8,16.1,14.3,14.2,12.8,11.8,13.4,10.8,12.4,13,15.4,14.6,15.9,15.4,16.6,19.8,20.8,21.4,21.2,24.8,23.8,26,27.7,27.2,28.4,29.2,31.9,32.8,31.4,29.4,27.9,27.1,24.7,23.1,24.3,22.3,19.6,18.5,18.2,12.9,12.5,10.6,12.4,9.7,12.8,13.6,12.3,15.9,16,17.5,16,17.1,19.7,21.6,21.5,22.9,24.5,24.5,26.2,28.8,29.2,29.9,31.1,31.6,31.8,30,28.7,25.8,22.5,23.1,20.6,18.7,18.9,16.2,14.6,14.9,13.1,12.2,9.1,7.3,8.1,8.7,13.8,11.6,15,12.3,14,16.4,14.8,16.9,16.1,18.6,20,19.8,20.5,23.4,24.7,28,27,29.2,28.2,27.3,24.9,23.4,20.4,19.2,17.9,16.7,14.4,13.9,13.9,12,12,9.5];
    makeMyDays(testTemps);
}