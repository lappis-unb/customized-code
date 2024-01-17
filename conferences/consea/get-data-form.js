function getDataForm() {
  const processId = 56; // lab 149
  const inputId = 358; // lab 117
  const process_url = `/assemblies/cnsan6/f/${processId}`;
  const choosedInput = document.querySelector(
    `[data-question-id="${inputId}"]`
  );
  if (choosedInput && window.location.href.includes(process_url)) {
    let dataList = [];
    let dataInEdition = null;

    const newForm = document.createElement("proposal-form");
    newForm.classList.add("form-container");
    newForm.innerHTML = `
  <section id="form-container">
    <div class="br-input">
      <label class="questionnaire-question" for="input-default">1. Título da proposta:</label>
      <input
        type="text"
        id="title"
        maxlength="50"
        placeholder="Título da proposta"
      />
    </div>

    <div class="br-textarea">
      <label class="questionnaire-question" for="identify-challenge">
        2. Identificar de forma objetiva e sintética qual o principal desafio a ser
        superado:
      </label>
      <textarea id="identify-challenge" rows="4" maxlength="200"></textarea>
    </div>

    <div class="br-textarea">
      <label class="questionnaire-question" for="describe">
        3. Descrever de forma objetiva e sintética qual principal medida a ser tomada
        para sua superação do desafio identificado:
      </label>
      <textarea id="describe" rows="4" maxlength="250"></textarea>
    </div>

    <div class="br-input">
      <label class="questionnaire-question" for="identify-entity">
        4. Identificar qual principal ente público federal deve deflagrar e liderar
        essa medida:
      </label>
      <input
        type="text"
        id="identify-entity"
        maxlength="50"
        placeholder="Texto"
      />
    </div>

    <label class="questionnaire-question">
      5. Qual eixo temático da 6 Conferência Nacional de Segurança Alimentar e
      Nutricional a proposta está relacionada?
    </label>
    <div class="br-radio">
      <input id="op-1" type="radio" name="radio" value="op-1" checked="checked" />
      <label for="op-1">Eixo 1 - Determinantes estruturais e macro desafios para e soberania e Segurança Alimentar e Nutricional</label>
    </div>
    <div class="br-radio">
      <input id="op-2" type="radio" name="radio" value="op-2" />
      <label for="op-2">Eixo 2 - Sistema Nacional de Segurança Alimentar e Nutricional e Políticas Públicas garantidoras do Direito Humano à Alimentação Adequada</label>
    </div>
    <div class="br-radio">
      <input id="op-3" type="radio" name="radio" value="op-3" />
      <label for="op-3">Eixo 3 - Democracia e Participação Social</label>
    </div>
    <div class="add-button-container">
      <button class="br-button secondary" id="add-proposal" type="button" disabled>
        <i class="fas fa-plus mr3" aria-hidden="true"></i>
        Adicionar Proposta
      </button>
    </div>
  </section>

  <div id="lista-propostas">
    <p>
      <strong>Propostas adicionadas:</strong>
      <span id="data-list-total">0</span>
    </p>
    <ul id="proposal-ul"></ul>
  </div>

  <style>
    .form-container {
      margin: 1rem 0;
    }
    .form-title {
      flex: 1;
    }
    .add-list {
      border-bottom: 1px solid #ccc;
      list-style: none;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .add-button-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 1.5rem 0;
      gap: 1rem;
    }
  </style>
  `;
    choosedInput.parentNode.insertBefore(newForm, choosedInput.nextSibling);
    choosedInput.style = "display: none;";

    const contadorEixo1 = document.createElement("p");
    contadorEixo1.textContent = "Propostas no Eixo 1: 0";
    const contadorEixo2 = document.createElement("p");
    contadorEixo2.textContent = "Propostas no Eixo 2: 0";
    const contadorEixo3 = document.createElement("p");
    contadorEixo3.textContent = "Propostas no Eixo 3: 0";

    const listaPropostas = document.getElementById("lista-propostas");
    listaPropostas.appendChild(contadorEixo1);
    listaPropostas.appendChild(contadorEixo2);
    listaPropostas.appendChild(contadorEixo3);

    function updateList() {
      const ul = document.getElementById("proposal-ul");
      ul.innerHTML = "";

      dataList.forEach((proposta, index) => {
        const li = document.createElement("li");
        li.classList = ["add-list li"];
        li.innerHTML = `<label class="form-title">${proposta.title}</label>`;

        const editButton = document.createElement("button");
        const formContainer = document.getElementById("title");
        editButton.classList = ["br-button circle terciary"];
        editButton.innerHTML =
          '<i class="fas fa-pen fa-solid" aria-hidden="true">';
        editButton.addEventListener("click", () => {
          if (
            confirm(
              "Deseja parar de criar uma nova proposta e editar uma existente?"
            )
          ) {
            editData(index);
            formContainer.focus();
          }
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList = ["br-button circle terciary"];
        deleteButton.innerHTML =
          '<i class="fas fa-xmark fa-solid" aria-hidden="true">';
        deleteButton.addEventListener("click", () => confirmsDeletion(index));

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        ul.appendChild(li);
      });

      const dataListTotal = document.getElementById("data-list-total");
      dataListTotal.textContent = `${dataList.length}`;

      if (choosedInput) {
        const inputFieldData =
          choosedInput.querySelector("input[type='text']") ||
          choosedInput.querySelector("textarea");
        if (inputFieldData) {
          inputFieldData.value = JSON.stringify(dataList);
        }
      }

      const addProposalButton = document.getElementById("add-proposal");
      if (dataList.length >= 25) {
        addProposalButton.disabled = true;
        alert("Você atingiu o limite máximo de 25 propostas.");
      } else {
        addProposalButton.disabled = false;
      }

      const eixo1Count = dataList.filter(
        (proposal) => proposal.axle === "op-1"
      ).length;
      const eixo2Count = dataList.filter(
        (proposal) => proposal.axle === "op-2"
      ).length;
      const eixo3Count = dataList.filter(
        (proposal) => proposal.axle === "op-3"
      ).length;

      contadorEixo1.textContent = `Quantidade de propostas relacionadas ao Eixo 1: ${eixo1Count}`;
      contadorEixo2.textContent = `Quantidade de propostas relacionadas ao Eixo 2: ${eixo2Count}`;
      contadorEixo3.textContent = `Quantidade de propostas relacionadas ao Eixo 3: ${eixo3Count}`;

      if (eixo1Count >= 3 && eixo2Count >= 3 && eixo3Count >= 3) {
        console.log("tá valido");
      }
    }

    function addData() {
      const title = document.getElementById("title").value;
      const identify_challenge =
        document.getElementById("identify-challenge").value;
      const describe = document.getElementById("describe").value;
      const identify_entity = document.getElementById("identify-entity").value;
      const axle = document.querySelector('input[name="radio"]:checked').value;

      if (dataInEdition !== null) {
        const isConfirmed = confirm(
          "Tem certeza que deseja sobrescrever as informações desta proposta?"
        );
        if (isConfirmed) {
          dataList[dataInEdition] = {
            title,
            identify_challenge,
            describe,
            identify_entity,
            axle,
          };
          dataInEdition = null;
        }
      } else {
        dataList.push({
          title,
          identify_challenge,
          describe,
          identify_entity,
          axle,
        });
      }

      updateList();

      document.getElementById("title").value = "";
      document.getElementById("identify-challenge").value = "";
      document.getElementById("describe").value = "";
      document.getElementById("identify-entity").value = "";
      document.getElementById("op-1").checked = true;

      const addBtn = document.getElementById("add-proposal");
      addBtn.innerHTML =
        '<i class="fas fa-plus mr3" aria-hidden="true"></i>Adicionar Proposta';
      addBtn.disabled = true;
    }

    function editData(index) {
      const data = dataList[index];
      dataInEdition = index;

      document.getElementById("title").value = data.title;
      document.getElementById("identify-challenge").value =
        data.identify_challenge;
      document.getElementById("describe").value = data.describe;
      document.getElementById("identify-entity").value = data.identify_entity;

      document.querySelector(
        `input[name="radio"][value="${data.axle}"]`
      ).checked = true;

      const addBtn = document.getElementById("add-proposal");
      addBtn.innerHTML =
        '<i class="fas fa-pen mr3" aria-hidden="true"></i> Salvar Edição';
      addBtn.disabled = false;

      updateList();
    }

    function confirmsDeletion(index) {
      const isConfirmed = confirm(
        "Tem certeza que deseja excluir esta proposta?"
      );
      if (isConfirmed) {
        dataList.splice(index, 1);
        dataInEdition = null;
        updateList();
      }
    }

    document.getElementById("add-proposal").addEventListener("click", () => {
      addData();
    });

    const formFields = [
      "title",
      "identify-challenge",
      "describe",
      "identify-entity",
      "op-1",
    ];
    const formFieldsElements = formFields.map((field) =>
      document.getElementById(field)
    );
    const addProposalButton = document.getElementById("add-proposal");

    formFieldsElements.forEach((field) => {
      field.addEventListener("input", () => {
        const allFieldsFilled = formFieldsElements.every(
          (input) => input.value.trim() !== ""
        );
        addProposalButton.disabled = !allFieldsFilled;
        const addBtn = document.getElementById("add-proposal");
        addBtn.innerHTML =
          dataInEdition !== null
            ? '<i class="fas fa-pen mr3" aria-hidden="true"></i> Salvar Edição'
            : '<i class="fas fa-plus mr3" aria-hidden="true"></i> Adicionar Proposta';
      });
    });

    updateList();
  }
}
