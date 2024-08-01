let currentPage = 1;
const issuesPerPage = 10;

document.getElementById('repo-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const repo = document.getElementById('repo').value;
    fetchRepoDetails(username, repo);
    fetchIssues(username, repo, currentPage);
});

async function fetchRepoDetails(username, repo) {
    const repoDetails = document.getElementById('repo-details');

    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}`);
        const repoData = await response.json();

        document.getElementById('repo-name').textContent = repoData.full_name;
        document.getElementById('repo-description').textContent = repoData.description || 'No description';
        document.getElementById('repo-language').textContent = repoData.language || 'N/A';
        document.getElementById('repo-stars').textContent = repoData.stargazers_count;
        document.getElementById('repo-forks').textContent = repoData.forks_count;

        repoDetails.classList.remove('hidden'); // Show repo details section
    } catch (error) {
        console.error('Error fetching repository details:', error);
    }
}

async function fetchIssues(username, repo, page) {
    const issuesList = document.getElementById('issues-list');
    issuesList.innerHTML = ''; // Clear previous results

    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/issues?per_page=${issuesPerPage}&page=${page}`);
        const issues = await response.json();

        issues.forEach(issue => {
            const issueItem = document.createElement('li');
            issueItem.className = 'issue-card p-6 bg-white shadow-lg rounded-lg cursor-pointer';
            issueItem.innerHTML = `
                <h2 class="text-xl font-semibold mb-2">${issue.title}</h2>
                <p class="text-gray-700">${issue.body ? issue.body.substring(0, 100) + '...' : 'No description'}</p>
                <a href="${issue.html_url}" target="_blank" class="text-blue-500 hover:text-blue-700">View on GitHub</a>
            `;
            issueItem.addEventListener('click', () => {
                window.location.href = `detail.html?username=${username}&repo=${repo}&issueNumber=${issue.number}`;
            });
            issuesList.appendChild(issueItem);
        });

        setupPagination(username, repo, page);

    } catch (error) {
        console.error('Error fetching issues:', error);
    }
}

function setupPagination(username, repo, currentPage) {
    const paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = ''; // Clear previous controls

    // Previous button
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.className = 'p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 mr-2';
        prevButton.addEventListener('click', () => {
            fetchIssues(username, repo, currentPage - 1);
        });
        paginationControls.appendChild(prevButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.className = 'p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150';
    nextButton.addEventListener('click', () => {
        fetchIssues(username, repo, currentPage + 1);
    });
    paginationControls.appendChild(nextButton);
}

document.addEventListener('DOMContentLoaded', function() {
    const username = getQueryParam('username');
    const repo = getQueryParam('repo');
    const issueNumber = getQueryParam('issueNumber');
    if (username && repo && issueNumber) {
        fetchIssueDetail(username, repo, issueNumber);
    }
});
