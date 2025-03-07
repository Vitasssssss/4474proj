// Store state
let state = {
  currentList: null,
  defaultLists: [],
  view: 'calendar' // 'calendar' or 'list'
};

// DOM Elements
const tripForm = document.getElementById('tripForm');
const tripSetup = document.getElementById('tripSetup');
const packingList = document.getElementById('packingList');
const calendarView = document.getElementById('calendarView');
const listView = document.getElementById('listView');
const viewToggleButtons = document.querySelectorAll('.btn-toggle');

// Event Listeners
tripForm.addEventListener('submit', handleTripFormSubmit);
viewToggleButtons.forEach(button => {
  button.addEventListener('click', () => toggleView(button.dataset.view));
});

function handleTripFormSubmit(e) {
  e.preventDefault();

  const tripDetails = {
    name: document.getElementById('tripName').value,
    destination: document.getElementById('destination').value,
    climate: document.getElementById('climate').value,
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value,
    travelers: {
      women: parseInt(document.getElementById('womenCount').value),
      men: parseInt(document.getElementById('menCount').value),
      children: parseInt(document.getElementById('childrenCount').value)
    }
  };

  createNewList(tripDetails);
  tripSetup.classList.add('hidden');
  packingList.classList.remove('hidden');
  renderCalendarView();
}

function createNewList(tripDetails) {
  state.currentList = {
    id: Date.now().toString(),
    tripDetails,
    schedule: [],
    defaultItems: []
  };
}

function addActivity(date) {
  const activityName = prompt('Enter activity name:');
  if (!activityName) return;

  const startTime = prompt('Enter start time (HH:MM):', '09:00');
  if (!startTime) return;

  const endTime = prompt('Enter end time (HH:MM):', '10:00');
  if (!endTime) return;

  const newActivity = {
    id: Date.now().toString(),
    name: activityName,
    startTime,
    endTime,
    items: []
  };

  const daySchedule = state.currentList.schedule.find(day => day.date === date);
  if (daySchedule) {
    daySchedule.activities.push(newActivity);
  } else {
    state.currentList.schedule.push({
      date,
      activities: [newActivity]
    });
  }

  renderCalendarView();
}

function addItem(date, activityId) {
  const itemName = prompt('Enter item name:');
  if (!itemName) return;

  const quantity = parseInt(prompt('Enter quantity:', '1'));
  if (isNaN(quantity)) return;

  const category = prompt('Enter category (e.g., Clothes, Electronics):', 'Clothes');
  if (!category) return;

  const newItem = {
    id: Date.now().toString(),
    name: itemName,
    quantity,
    category,
    packed: false
  };

  const daySchedule = state.currentList.schedule.find(day => day.date === date);
  if (daySchedule) {
    const activity = daySchedule.activities.find(act => act.id === activityId);
    if (activity) {
      activity.items.push(newItem);
      renderCalendarView();
    }
  }
}

function toggleItemPacked(date, activityId, itemId) {
  const daySchedule = state.currentList.schedule.find(day => day.date === date);
  if (daySchedule) {
    const activity = daySchedule.activities.find(act => act.id === activityId);
    if (activity) {
      const item = activity.items.find(item => item.id === itemId);
      if (item) {
        item.packed = !item.packed;
        renderCalendarView();
      }
    }
  }
}

function toggleView(view) {
  state.view = view;
  viewToggleButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.view === view);
  });
  
  if (view === 'calendar') {
    calendarView.classList.remove('hidden');
    listView.classList.add('hidden');
    renderCalendarView();
  } else {
    listView.classList.remove('hidden');
    calendarView.classList.add('hidden');
    renderListView();
  }
}

function renderCalendarView() {
  if (!state.currentList) return;

  const { startDate, endDate } = state.currentList.tripDetails;
  const days = getDaysBetweenDates(startDate, endDate);
  
  calendarView.innerHTML = days.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    return `
      <div class="calendar-day">
        <div class="calendar-day-header">
          <h3>${formatDate(date)}</h3>
          <button class="btn-toggle" onclick="addActivity('${dateStr}')">Add Activity</button>
        </div>
        <div class="activities">
          ${renderActivities(dateStr)}
        </div>
      </div>
    `;
  }).join('');
}

function renderListView() {
  if (!state.currentList) return;

  const items = getAllItems();
  const categories = groupItemsByCategory(items);

  listView.innerHTML = Object.entries(categories).map(([category, items]) => `
    <div class="list-category">
      <h3 class="list-category-header">${category}</h3>
      ${items.map(item => `
        <div class="list-item">
          <input type="checkbox" class="list-item-checkbox" 
            ${item.packed ? 'checked' : ''} 
            onchange="toggleItemPacked('${item.date}', '${item.activityId}', '${item.id}')">
          <span>${item.name} (${item.quantity})</span>
        </div>
      `).join('')}
    </div>
  `).join('');
}

function renderActivities(date) {
  const daySchedule = state.currentList.schedule.find(day => day.date === date);
  if (!daySchedule) return '';

  return daySchedule.activities.map(activity => `
    <div class="activity-block">
      <h4>${activity.name}</h4>
      <p>${activity.startTime} - ${activity.endTime}</p>
      <button class="btn-toggle" onclick="addItem('${date}', '${activity.id}')">Add Item</button>
      <div class="activity-items">
        ${activity.items.map(item => `
          <div class="list-item">
            <input type="checkbox" 
              ${item.packed ? 'checked' : ''} 
              onchange="toggleItemPacked('${date}', '${activity.id}', '${item.id}')">
            <span>${item.name} (${item.quantity})</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// Utility Functions
function getDaysBetweenDates(start, end) {
  const dates = [];
  let currentDate = new Date(start);
  const endDate = new Date(end);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

function getAllItems() {
  if (!state.currentList) return [];
  
  return state.currentList.schedule.flatMap(day => 
    day.activities.flatMap(activity => 
      activity.items.map(item => ({
        ...item,
        date: day.date,
        activityId: activity.id
      }))
    )
  );
}

function groupItemsByCategory(items) {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Set default dates to today and tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  document.getElementById('startDate').value = today.toISOString().split('T')[0];
  document.getElementById('endDate').value = tomorrow.toISOString().split('T')[0];
});