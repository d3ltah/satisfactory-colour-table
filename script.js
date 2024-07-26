const ficsitTickURL =
	"https://satisfactory.wiki.gg/images/1/1d/FICSIT_Inc..png";

const checkboxes = document.querySelectorAll(".checkbox-container");
const searchInput = document.getElementById("search-input");

const ficsitCheckmarks = document.querySelectorAll(".ficsit-checkmark");

checkboxes.forEach((checkbox) => {
	checkbox.addEventListener("click", (e) => {
		checkbox.getElementsByClassName("checkbox")[0].classList.toggle("checked");
		loadResults();
	});
});

searchInput.addEventListener("input", (e) => {
	loadResults();
});

ficsitCheckmarks.forEach((ficsitCheckmark) => {
	fetch("img/ficsit_checkmark.svg")
		.then((response) => response.text())
		.then((data) => {
			ficsitCheckmark.innerHTML = data;
		});
});

function loadResults() {
	fetch("colours/colours.json")
		.then((response) => response.json())
		.then((data) => {
			const results = document.getElementById("results");

			results.innerHTML = "";

			const colours = data.colours.sort((a, b) =>
				b.aliases[0].localeCompare(a.aliases[0])
			);

			let selectedCategories = [];
			checkboxes.forEach((checkbox) => {
				if (
					checkbox
						.getElementsByClassName("checkbox")[0]
						.classList.contains("checked")
				) {
					selectedCategories.push(checkbox.querySelector("label").innerText);
				}
			});

			// add colours if any of their aliases match the contents of the search bar
			// and their category matches the selected checkbox(es)
			colours.forEach((colour) => {
				if (
					colour.aliases.some((alias) => {
						return searchInput.value === ""
							? true
							: alias.toLowerCase().includes(searchInput.value.toLowerCase());
					}) &&
					selectedCategories.includes(colour.category)
				) {
					const row = results.insertRow(0);

					const colourCell = row.insertCell(0);
					colourCell.classList.add("colour-cell");
					colourCell.style.backgroundColor = "#" + colour.colour;

					const nameCell = row.insertCell(1);
					nameCell.innerText = colour.aliases[0];

                    row.addEventListener("click", () => {
                        navigator.clipboard.writeText(`#${colour.colour}`);
                        nameCell.innerText = "Copied!";
                        setTimeout(() => (nameCell.innerText = colour.aliases[0]), 1000);
                    })
				}
			});

			const missingResults = document.getElementById("missing-results");
			if (results.children.length === 0) {
				missingResults.style.display = "block";
			} else {
				missingResults.style.display = "none";
			}
		});
}

loadResults();

fetch("colours/colours.json")
    .then((response) => response.json())
    .then((data) => {
        searchInput.placeholder = `Search ${data.colours.length} colours`;
    });
