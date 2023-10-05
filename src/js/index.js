class SelectMultiple {
  constructor(selector) {
    this.select = document.querySelector(selector);
    this.selectorUniqueId =
      "selectMultiple" + selector.replace(".", "-").replace("#", "-");
    this.selectOptions = Array.from(this.select.querySelectorAll("option"));
    this.placeholder = this.select.dataset.placeholder;
    this.newSelect = document.createElement("div");

    this.init();
  }

  createActiveElement() {
    const active = document.createElement("div");
    active.classList.add("active");

    const span = document.createElement("span");
    span.innerText = this.placeholder;
    active.appendChild(span);

    this.selectOptions.forEach((option) => {
      if (option.selected) {
        active.appendChild(this.createSelectedLink(option));
      }
    });

    const arrow = document.createElement("div");
    arrow.classList.add("arrow");
    active.appendChild(arrow);

    return active;
  }

  createOptionList() {
    const optionList = document.createElement("ul");
    optionList.className = "dropdown-select-list";
    this.selectOptions.forEach((option) => {
      const item = document.createElement("li");
      item.dataset.value = option.value;
      item.className = "dropdown-select-list__option";
      if (option.selected) {
        item.classList.add("selected");
      }
      item.innerHTML = option.innerText;
      optionList.appendChild(item);
    });

    return optionList;
  }

  createSelectedLink(option) {
    const link = document.createElement("a");
    link.dataset.value = option.value;
    link.innerHTML = `<em>${option.innerText}</em><i></i>`;

    link.querySelector("i").addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      option.selected = false;
      this.updateSelectedCards();
      this.saveSelectedOptions();
    });

    return link;
  }

  addEventListeners() {
    this.newSelect
      .querySelector(this.selectorUniqueId + " > div")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        this.newSelect.classList.toggle("open");
      });

    this.newSelect
      .querySelectorAll(this.selectorUniqueId + " ul li")
      .forEach((li) => {
        li.addEventListener("click", (e) => {
          e.stopPropagation();
          const value = li.dataset.value;
          const option = this.select.querySelector(`option[value="${value}"]`);

          if (option && !option.selected) {
            option.selected = true;
            option.setAttribute("selected", true);
            this.newSelect
              .querySelector(".active")
              .appendChild(this.createSelectedLink(option));
          } else {
            option.selected = false;
            option.setAttribute("selected", false);
          }

          li.classList.toggle("selected");
          this.updateSelectedCards();
          this.saveSelectedOptions();
        });
      });
  }

  saveSelectedOptions() {
    const selectedValues = Array.from(this.select.selectedOptions).map(
      (opt) => opt.value
    );
    localStorage.setItem(
      this.selectorUniqueId + "selectedOptions",
      JSON.stringify(selectedValues)
    );
  }

  loadSelectedOptions() {
    const selectedValuesJSON = localStorage.getItem(
      this.selectorUniqueId + "selectedOptions"
    );

    if (selectedValuesJSON) {
      const selectedValues = JSON.parse(selectedValuesJSON);
      selectedValues.forEach((value) => {
        const option = this.select.querySelector(`option[value="${value}"]`);
        const liItemEl = document.querySelector(
          this.selectorUniqueId + ` li[data-value="${value}"]`
        );
        liItemEl.classList.add("selected");
        if (option) {
          option.selected = true;
          this.newSelect
            .querySelector(".active")
            .appendChild(this.createSelectedLink(option));
        }
      });
      this.updateSelectedCards();
    }
  }

  updateSelectedCards() {
    const activeDiv = this.newSelect.querySelector(".active");
    const selectedOptions = Array.from(this.select.selectedOptions);
    const selectedValues = selectedOptions.map((opt) => opt.value);
    const placeHolder = activeDiv.querySelector("span");
    const aElements = activeDiv.querySelectorAll("a");
    if (selectedValues.length > 0) {
      placeHolder.style.display = "none";
      aElements.forEach((aElement) => {
        if (selectedValues.includes(aElement.dataset.value)) {
          aElement.classList.add("selected-item-card");
        } else {
          const liItemEl = document.querySelector(
            this.selectorUniqueId +
              ` li[data-value="${aElement.dataset.value}"]`
          );
          liItemEl.classList.remove("selected");
          aElement.remove();
        }
      });
    } else {
      aElements.forEach((aElement) => {
        aElement.style.display = "none";
        aElement.classList.remove("selected-item-card");
      });
      placeHolder.style.display = "inline-block";
    }
  }

  init() {
    this.newSelect.classList.add(this.selectorUniqueId);
    this.newSelect.classList.add("selectMultiple");
    this.selectorUniqueId = "." + this.selectorUniqueId;
    const active = this.createActiveElement();
    const optionList = this.createOptionList();

    this.newSelect.appendChild(active);
    this.newSelect.appendChild(optionList);
    this.select.parentElement.insertBefore(
      this.newSelect,
      this.select.nextSibling
    );
    this.newSelect.appendChild(this.select);

    this.addEventListeners();
    this.loadSelectedOptions();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new SelectMultiple(".select-businesses");
  new SelectMultiple(".select-businesses-2");

  document.body.addEventListener("click", function (e) {
    const selectMultiple = document.querySelector(".selectMultiple");

    if (!selectMultiple.contains(e.target)) {
      selectMultiple.classList.remove("open");
    }
  });
});
