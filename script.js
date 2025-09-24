const TOTAL_ANNUAL_HOURS = 175;

function roundToQuarterHour(hours) {
    return Math.round(hours * 4) / 4;
}

function createPeriodForm(i) {
    return `
        <div class="period">
            <h3>Period ${i}</h3>
            Start: <input type="date" id="start${i}"><br><br>
            End: <input type="date" id="end${i}"><br><br>
            EFT: <input type="number" step="0.001" min="0" max="1" id="eft${i}"><br>
        </div>
    `;
}

document.getElementById("periods").addEventListener("change", function() {
    const count = parseInt(this.value);
    const container = document.getElementById("periods-container");
    container.innerHTML = "";
    for (let i = 1; i <= count; i++) {
        container.innerHTML += createPeriodForm(i);
    }
});

function calculateAll() {
    const count = parseInt(document.getElementById("periods").value);
    let totalUnrounded = 0;
    let totalRounded = 0;
    let resultsHtml = "<h2>Results</h2>";

    for (let i = 1; i <= count; i++) {
        const start = new Date(document.getElementById(`start${i}`).value);
        const end = new Date(document.getElementById(`end${i}`).value);
        const eft = parseFloat(document.getElementById(`eft${i}`).value) || 0;

        if (!(start instanceof Date) || isNaN(start) || !(end instanceof Date) || isNaN(end)) {
            resultsHtml += `<p>Period ${i}: Invalid dates</p>`;
            continue;
        }

        if (end < start) {
            resultsHtml += `<p>Period ${i}: End date must be after start date</p>`;
            continue;
        }

        const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const weeks = Math.floor(totalDays / 7);
        const days = totalDays % 7;

        const rawHours = ((totalDays / 365) * TOTAL_ANNUAL_HOURS * eft);
        const roundedHours = roundToQuarterHour(rawHours);

        resultsHtml += `<p>Period ${i}: ${weeks} week(s) and ${days} day(s) → Unrounded: ${rawHours.toFixed(2)}h, Rounded: ${roundedHours.toFixed(2)}h</p>`;

        totalUnrounded += rawHours;
        totalRounded += roundedHours;
    }

    resultsHtml += `<h3>Grand Total: Unrounded ${totalUnrounded.toFixed(2)}h, Rounded ${totalRounded.toFixed(2)}h</h3>`;
    document.getElementById("results").innerHTML = resultsHtml;
}

// Trigger default form for 1 period
document.getElementById("periods").dispatchEvent(new Event("change"));
