const SelectMultiple = (function () {
  let select;
  let selectOptions;
  let placeholder;
  let newSelect;

  function createActiveElement() {
    const active = document.createElement("div");
    active.classList.add("active");

    const span = document.createElement("span");
    span.innerText = placeholder;
    active.appendChild(span);

    selectOptions.forEach((option) => {
      if (option.selected) {
        active.appendChild(createSelectedLink(option));
      }
    });

    const arrow = document.createElement("div");
    arrow.classList.add("arrow");
    active.appendChild(arrow);

    return active;
  }

  function createOptionList() {
    const optionList = document.createElement("ul");

    selectOptions.forEach((option) => {
      const item = document.createElement("li");
      item.dataset.value = option.value;
      item.innerHTML = option.innerText;
      optionList.appendChild(item);
    });

    return optionList;
  }

  function createSelectedLink(option) {
    const link = document.createElement("a");
    link.dataset.value = option.value;
    link.innerHTML = `<em>${option.innerText}</em><i></i>`;

    link.querySelector("i").addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      link.remove();
      option.selected = false;
      updateActiveDiv();
      saveSelectedOptions();
    });

    return link;
  }

  function addEventListeners() {
    newSelect
      .querySelector(".selectMultiple > div")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        newSelect.classList.toggle("open");
      });

    newSelect.querySelector(".active").addEventListener("click", (e) => {
      e.stopPropagation();
      const selectedOptions = Array.from(select.selectedOptions);
    });

    newSelect.querySelectorAll(".selectMultiple ul li").forEach((li) => {
      li.addEventListener("click", (e) => {
        e.stopPropagation();
        const value = li.dataset.value;
        const option = select.querySelector(`option[value="${value}"]`);

        if (option && !option.selected) {
          option.selected = true;
          newSelect
            .querySelector(".active")
            .appendChild(createSelectedLink(option));
        }

        li.classList.toggle("selected");
        updateActiveDiv();
        saveSelectedOptions();
      });
    });
  }

  function saveSelectedOptions() {
    const selectedValues = Array.from(select.selectedOptions).map(
      (opt) => opt.value
    );
    localStorage.setItem("selectedOptions", JSON.stringify(selectedValues));
  }

  function loadSelectedOptions() {
    const selectedValuesJSON = localStorage.getItem("selectedOptions");

    if (selectedValuesJSON) {
      const selectedValues = JSON.parse(selectedValuesJSON);

      selectedValues.forEach((value) => {
        const option = select.querySelector(`option[value="${value}"]`);

        if (option) {
          option.selected = true;
          newSelect
            .querySelector(".active")
            .appendChild(createSelectedLink(option));
        }
      });

      updateActiveDiv();
    }
  }

  function updateActiveDiv() {
    const activeDiv = newSelect.querySelector(".active");
    const selectedOptions = Array.from(select.selectedOptions);
    const selectedValues = selectedOptions.map((opt) => opt.value);
    const span = activeDiv.querySelector("span");
    const aElements = activeDiv.querySelectorAll("a");

    if (selectedValues.length > 0) {
      span.style.display = "none";
      aElements.forEach((aElement) => {
        aElement.style.display = "inline-block";
      });
    } else {
      aElements.forEach((aElement) => {
        aElement.style.display = "none";
      });
      span.style.display = "inline-block";
    }
  }

  return {
    init: function () {
      select = document.querySelector("select[multiple]");
      selectOptions = Array.from(select.querySelectorAll("option"));
      placeholder = select.dataset.placeholder;

      newSelect = document.createElement("div");
      newSelect.classList.add("selectMultiple");

      const active = createActiveElement();
      const optionList = createOptionList();

      newSelect.appendChild(active);
      newSelect.appendChild(optionList);
      select.parentElement.insertBefore(newSelect, select.nextSibling);
      newSelect.appendChild(select);

      addEventListeners();
      loadSelectedOptions();
    },
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  SelectMultiple.init();

  document.body.addEventListener("click", function (e) {
    const selectMultiple = document.querySelector(".selectMultiple");

    if (!selectMultiple.contains(e.target)) {
      selectMultiple.classList.remove("open");
    }
  });
});
