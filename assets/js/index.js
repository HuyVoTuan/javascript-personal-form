const API_URL = 'http://localhost:3005';

import { fetchAPI } from './axios.js';

/* ELEMENT SELECTORS */
const formEl = document.getElementById('form');
const firstnameInputEl = document.getElementById('firstname');
const lastnameInputEl = document.getElementById('lastname');
const emailInputEl = document.getElementById('email');
const addressInputEl = document.getElementById('address');
const cityInputEl = document.getElementById('city');
const districtInputEl = document.getElementById('district');
const tableBodyEl = document.getElementById('tbody');
const tableHeadActionsEl = document.getElementById('actions');

// TODO: REFACTOR CODE
const totalPagesEl = document.getElementById('total-pages');
const limitItemsEl = document.getElementById('limit-items');
const limitItemEl = document.getElementById('limit-item');
const totalItemsEl = document.getElementById('total-items');

/* UTILS */
const emailRegex = (input) => {
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  return input.match(validRegex);
};

/* RENDER ELEMENTS */
const renderTableCell = (value) => {
  const tdEl = document.createElement('td');

  tdEl.classList.add(
    'md:text-md',
    'p-10',
    'text-center',
    'text-sm',
    'lg:text-xl',
    'border',
    'border-slate-300',
  );

  tdEl.textContent = value ?? '';

  return tdEl;
};

const renderTableActionButton = ({ btnType, btnColor, clickHandler }) => {
  const btnEl = document.createElement('button');

  const processedBtnColor = btnColor.toLowerCase();
  const processedBtnType = btnType.charAt(0).toUpperCase() + btnType.slice(1);

  btnEl.textContent = `${processedBtnType}`;

  btnEl.classList.add(
    `bg-${processedBtnColor}-500`,
    `hover:bg-${processedBtnColor}-700`,
    'text-white',
    'font-bold',
    'py-2',
    'px-4',
    'lg:px-8',
    'lg:py-4',
    'rounded',
    'mr-4',
  );

  btnEl.addEventListener('click', clickHandler);

  return btnEl;
};

/* BUSINESS LOGIC */
const resetForm = (errors) => {
  formEl.reset();
  renderFormErrors(errors);
};

const validateForm = () => {
  const errors = {};

  !firstnameInputEl || firstnameInputEl.value.trim() === ''
    ? (errors.firstname = 'Firstname is required')
    : (errors.firstname = '');

  !lastnameInputEl || lastnameInputEl.value.trim() === ''
    ? (errors.lastname = 'Lastname is required')
    : (errors.lastname = '');

  !emailInputEl || emailInputEl.value.trim() === ''
    ? (errors.email = 'Email is required')
    : (errors.email = '');

  !emailRegex(emailInputEl.value.trim())
    ? (errors.email = 'Email is invalid')
    : (errors.email = '');

  !addressInputEl || addressInputEl.value.trim() === ''
    ? (errors.address = 'Address is required')
    : (errors.address = '');

  !cityInputEl || cityInputEl.value === 'default'
    ? (errors.city = 'City is required')
    : (errors.city = '');

  !districtInputEl || districtInputEl.value === 'default'
    ? (errors.district = 'District is required')
    : (errors.district = '');

  return errors;
};

const renderFormErrors = (errors) => {
  Object.entries(errors).forEach(([inputType, errorMsg]) => {
    const childEl = document.getElementById(inputType);
    const parentEl = childEl.parentElement;

    parentEl.getElementsByTagName('span')[0].textContent = errorMsg;
  });
};

const renderData = (dataSource) => {
  if (dataSource.length > 0) {
    // Reset table body content
    tableBodyEl.innerHTML = '';

    dataSource.map((data) => {
      const trEl = document.createElement('tr');
      trEl.setAttribute('scope', 'row');

      // Destructure each user data details or properties
      const { id, first_name, last_name } = data;

      // Combine to full name
      const full_name = `${first_name} ${last_name}`;

      // Render each user data values to table data element
      Object.values({
        full_name,
        email: 'test@example.com',
        address: 'test address',
        city: 'test city',
        country: 'test country',
      }).forEach((value) => {
        const tableDataEl = renderTableCell(value);
        trEl.appendChild(tableDataEl);
      });

      // Render action buttons ('Edit' and 'Delete' buttons) for each table row
      const tdEl = document.createElement('td');

      tdEl.setAttribute('id', 'actions-button');
      tdEl.classList.add('text-center', 'border', 'border-slate-300');

      const editBtn = renderTableActionButton({
        btnType: 'edit',
        btnColor: 'yellow',
        clickHandler: () => updateData(API_URL, _id),
      });
      const deleteBtn = renderTableActionButton({
        btnType: 'delete',
        btnColor: 'red',
        clickHandler: () => deleteData(API_URL, _id),
      });

      tdEl.appendChild(editBtn);
      tdEl.appendChild(deleteBtn);

      trEl.appendChild(tdEl);

      tableBodyEl.appendChild(trEl);
    });
  }
};

/* INITIALIZE APP */
const initApp = async () => {
  // Form submission handling
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const errorResults = validateForm();
    const isFormValid = Object.values(errorResults).every(
      (error) => error === '',
    );

    if (!isFormValid) {
      renderFormErrors(errorResults);
      return;
    }

    resetForm(errorResults);
  });

  // Get data and display from API
  const apiResult = await fetchAPI({
    url: `${API_URL}/api/member/`,
    options: {
      method: 'GET',
    },
  });

  const { data } = apiResult;

  totalPagesEl.innerText = Math.ceil(data.total / data.limit);
  limitItemsEl.innerText = data.limit;
  totalItemsEl.innerText = data.total;
  renderData(data.data);

  // TODO: Implement pagination
  limitItemEl.addEventListener('input', async (e) => {
    const value = e.target.value;
    console.log('value', value);

    const paginatedData = await fetchAPI({
      url: `${API_URL}/api/member/?limit=${value}&page=1`,
      options: {
        method: 'GET',
      },
    });

    const { data } = paginatedData;

    totalPagesEl.innerText = Math.ceil(data.total / data.limit);
    limitItemsEl.innerText = data.limit;
    totalItemsEl.innerText = data.total;
    renderData(data.data);
  });
};

initApp();
