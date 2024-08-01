document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const repo = urlParams.get('repo');
    const issueNumber = urlParams.get('issueNumber');

    if (username && repo && issueNumber) {
        fetchIssueDetail(username, repo, issueNumber);
    } else {
        console.error('Missing query parameters');
    }
});

async function fetchIssueDetail(username, repo, issueNumber) {
    const noChartsMessage = document.getElementById('no-charts-message');

    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/issues/${issueNumber}`);
        const issue = await response.json();

        document.getElementById('issue-title').textContent = issue.title;
        document.getElementById('issue-body').textContent = issue.body || 'No description';
        document.getElementById('issue-url').href = issue.html_url;

        const creationDatesChart = document.getElementById('issue-creation-dates-chart');
        const labelsChart = document.getElementById('issue-labels-chart');

        // Fake data for creation dates chart
        const creationDatesCtx = creationDatesChart.getContext('2d');
        new Chart(creationDatesCtx, {
            type: 'line',
            data: {
                labels: ['2021-01-01', '2021-02-01', '2021-03-01'],
                datasets: [{
                    label: 'Issue Creation Dates',
                    data: [5, 10, 3],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)'
                }]
            }
        });

        // Fake data for labels chart
        const labelsCtx = labelsChart.getContext('2d');
        new Chart(labelsCtx, {
            type: 'bar',
            data: {
                labels: ['bug', 'feature', 'enhancement'],
                datasets: [{
                    label: 'Issue Labels',
                    data: [3, 5, 2],
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            }
        });

        // Show the charts section
        noChartsMessage.classList.add('hidden');
    } catch (error) {
        console.error('Error fetching issue details:', error);
        const chartsSection = document.getElementById('charts-section');
        const noChartsMessage = document.getElementById('no-charts-message');
        chartsSection.innerHTML = ''; // Clear charts section
        noChartsMessage.classList.remove('hidden');
    }
}
