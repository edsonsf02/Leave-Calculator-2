const TOTAL_ANNUAL_HOURS = 175;

// Function to round hours to nearest 0.25
function roundToQuarterHour(hours) {
    return Math.round(hours * 4) / 4;
}

// Generate a single period input form
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

// Dynamically generate period forms when dropdown changes
document.getElementById("periods").addEventListener("change", function() {
    const count = parseInt(this.value);
    const container = document.getElementById("periods-container");
    container.innerHTML = "";
    for (let i = 1; i <= count; i++) {
        container.innerHTML += createPeriodForm(i);
    }
});

// Main calculation function
function calculateAll() {
    const count = parseInt(document.getElementById("periods").value);
    let totalUnrounded = 0;
    let totalRounded = 0;

    // Start building table
    let resultsHtml = `
      <h2>Results</h2>
      <table>
        <thead>
          <tr>
            <th>Period</th>
            <th>Weeks & Days</th>
            <th>Unrounded Hours</th>
            <th>Rounded Hours</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = 1; i <= count; i++) {
        const start = new Date(document.getElementById(`start${i}`).value);
        const end = new Date(document.getElementById(`end${i}`).value);
        const eft = parseFloat(document.getElementById(`eft${i}`).value) || 0;

        if (!(start instanceof Date) || isNaN(start) || !(end instanceof Date) || isNaN(end)) {
            resultsHtml += `<tr><td colspan="4">Period ${i}: Invalid dates</td></tr>`;
            continue;
        }

        if (end < start) {
            resultsHtml += `<tr><td colspan="4">Period ${i}: End date must be after start date</td></tr>`;
            continue;
        }

        const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const weeks = Math.floor(totalDays / 7);
        const days = totalDays % 7;

        const rawHours = ((totalDays / 365) * TOTAL_ANNUAL_HOURS * eft);
        const roundedHours = roundToQuarterHour(rawHours);

        resultsHtml += `
          <tr>
            <td>Period ${i}</td>
            <td>${weeks} week(s) & ${days} day(s)</td>
            <td>${rawHours.toFixed(2)}h</td>
            <td>${roundedHours.toFixed(2)}h</td>
          </tr>
        `;

        totalUnrounded += rawHours;
        totalRounded += roundedHours;
    }

    // Grand total row
    resultsHtml += `
        </tbody>
        <tfoot>
          <tr>
            <th colspan="2">Grand Total</th>
            <th>${totalUnrounded.toFixed(2)}h</th>
            <th>${totalRounded.toFixed(2)}h</th>
          </tr>
        </tfoot>
      </table>
    `;

    document.getElementById("results").innerHTML = resultsHtml;
}

// Trigger default form for 1 period on page load
document.getElementById("periods").dispatchEvent(new Event("change"));
