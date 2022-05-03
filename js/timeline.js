window.addEventListener('DOMContentLoaded', () => {
    // Calculate the durations between the timeline events
    let times = document.getElementsByTagName('time');
    let durations = Array();
    let minDuration = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < times.length - 1; i++) {
        let d1 = new Date(times[i].dateTime);
        let d2 = new Date(times[i+1].dateTime);
        let currDuration = d2.getTime() - d1.getTime();
        if (currDuration < minDuration) {
            minDuration = currDuration;
        }
        durations.push(currDuration);
    }
    for (let i = 0; i < durations.length; i++) {
        durations[i] = durations[i] / minDuration;
    }

    // Traverse through the DOM tree adding in extra elems to make the timeline the right length
    let timeline = document.getElementById('timeline');

    let currChild = timeline.firstChild;
    while (currChild != null) {
        if (currChild instanceof Element) {
            currChild.style.marginBottom = `${durations[0]}rem`;
            durations.shift();
        }
        currChild = currChild.nextSibling;
    }
});