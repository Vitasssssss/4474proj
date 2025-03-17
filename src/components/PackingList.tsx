import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Calendar, Grid, AlertCircle, Clock } from 'lucide-react';

// Define item type
interface Item {
  id: string;
  name: string;
  category: string;
  quantity: number;
  activityId?: string;
  date?: string;
}

// Define activity type
interface Activity {
  id: string;
  name: string;
  date: string;
  startTime?: string; // 添加开始时间
  endTime?: string;   // 添加结束时间
}

interface TripInfo {
  tripName: string;
  destination: { label: string; value: string };
  startDate: string;
  endDate: string;
}

interface PackingListProps {
  onBack: () => void;
  userId?: string;
  tripInfo?: TripInfo;
}

function PackingList({ onBack, userId, tripInfo }: PackingListProps) {
  // State management
  const [viewMode, setViewMode] = useState<'date' | 'category'>('date'); // View mode
  const [items, setItems] = useState<Item[]>([]); // All items
  const [activities, setActivities] = useState<Activity[]>([]); // Activities list
  const [dates, setDates] = useState<string[]>([]); // Dates list
  const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({
    name: '',
    category: '',
    quantity: 1
  });
  
  // 修改活动状态，添加时间字段
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    name: '',
    date: '',
    startTime: '',
    endTime: ''
  });
  
  // 添加活动表单显示状态
  const [showAddActivityForm, setShowAddActivityForm] = useState<string | null>(null);
  const [validationError, setValidationError] = useState('');
  
  // 为每个区域创建专门的添加项目状态
  const [showAddItemForm, setShowAddItemForm] = useState<{
    type: 'unassigned' | 'date' | 'activity';
    id?: string;
  } | null>(null);

  // Add new item
  const handleAddItem = (type: 'unassigned' | 'date' | 'activity', id?: string) => {
    if (!newItem.name) {
      setValidationError('Item name is required');
      return;
    }
    
    setValidationError('');
    
    const item: Item = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category || 'Uncategorized',
      quantity: newItem.quantity || 1
    };
    
    // Assign item based on selection
    if (type === 'date' && id) {
      item.date = id;
    } else if (type === 'activity' && id) {
      const activity = activities.find(a => a.id === id);
      if (activity) {
        item.activityId = id;
        item.date = activity.date;
      }
    }
    
    setItems([...items, item]);
    setNewItem({ name: '', category: '', quantity: 1 });
    setShowAddItemForm(null); // 关闭添加表单
  };

  // Add new activity
  const handleAddActivity = (date: string) => {
    if (!newActivity.name) {
      setValidationError('Activity name is required');
      return;
    }
    
    setValidationError('');
    
    const activity: Activity = {
      id: Date.now().toString(),
      name: newActivity.name,
      date: date,
      startTime: newActivity.startTime || undefined,
      endTime: newActivity.endTime || undefined
    };
    
    setActivities([...activities, activity]);
    setNewActivity({ name: '', date: '', startTime: '', endTime: '' });
    setShowAddActivityForm(null);
  };

  // Update item
  const handleUpdateItem = (id: string, updates: Partial<Item>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Delete activity
  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
    // Set items in this activity to unassigned
    setItems(items.map(item => item.activityId === id ? { ...item, activityId: undefined } : item));
  };

  // Group items by category
  const getItemsByCategory = () => {
    const grouped: Record<string, Item[]> = {};
    
    items.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    
    return grouped;
  };

  // Get unassigned items
  const getUnassignedItems = () => {
    return items.filter(item => !item.date && !item.activityId);
  };

  // Get items and activities for a specific date
  const getItemsAndActivitiesByDate = (date: string) => {
    // 获取指定日期的活动，并按时间排序
    const dateActivities = activities
      .filter(activity => activity.date === date)
      .sort((a, b) => {
        // 有时间的排在前面
        if (a.startTime && !b.startTime) return -1;
        if (!a.startTime && b.startTime) return 1;
        // 如果都有时间，按开始时间排序
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        // 都没有时间就保持原顺序
        return 0;
      });
      
    const dateItemsNoActivity = items.filter(item => item.date === date && !item.activityId);
    
    return { dateActivities, dateItemsNoActivity };
  };

  // Initialize dates from trip info
  useEffect(() => {
    if (tripInfo?.startDate && tripInfo?.endDate) {
      const dateList: string[] = [];
      let currentDate = new Date(tripInfo.startDate);
      const lastDate = new Date(tripInfo.endDate);
      
      while (currentDate <= lastDate) {
        dateList.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setDates(dateList);
    }
  }, [tripInfo]);

  // 添加项目表单
  const renderAddItemForm = (type: 'unassigned' | 'date' | 'activity', id?: string) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Add Item</h3>
        <button
          onClick={() => setShowAddItemForm(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium mb-1">Item Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className={`w-full px-3 py-2 border ${validationError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g. Toothbrush, T-shirt"
          />
          {validationError && (
            <p className="mt-1 text-red-500 text-sm flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {validationError}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Clothing, Toiletries"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <button
        onClick={() => handleAddItem(type, id)}
        className="w-full bg-blue-600 text-white flex items-center justify-center py-2 px-4 rounded-md hover:bg-blue-700"
      >
        <Plus size={20} className="mr-2" />
        Add Item
      </button>
    </div>
  );

  // 添加活动表单
  const renderAddActivityForm = (date: string) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Add Activity for {date}</h3>
        <button
          onClick={() => setShowAddActivityForm(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium mb-1">Activity Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={newActivity.name}
            onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
            className={`w-full px-3 py-2 border ${validationError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g. Breakfast, Museum Visit, Beach"
          />
          {validationError && (
            <p className="mt-1 text-red-500 text-sm flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {validationError}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Start Time (Optional)</label>
            <input
              type="time"
              value={newActivity.startTime}
              onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time (Optional)</label>
            <input
              type="time"
              value={newActivity.endTime}
              onChange={(e) => setNewActivity({ ...newActivity, endTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <button
        onClick={() => handleAddActivity(date)}
        className="w-full bg-blue-600 text-white flex items-center justify-center py-2 px-4 rounded-md hover:bg-blue-700"
      >
        <Plus size={20} className="mr-2" />
        Add Activity
      </button>
    </div>
  );

  // Render item component
  const renderItem = (item: Item) => (
    <div key={item.id} className="flex items-center bg-white p-2 rounded-md shadow-sm border border-gray-200 mb-2">
      <div className="flex flex-1 items-center space-x-2">
        <input
          type="text"
          value={item.name}
          onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
          className="flex-1 px-2 py-1 border border-gray-300 rounded"
        />
        <input
          type="text"
          value={item.category}
          onChange={(e) => handleUpdateItem(item.id, { category: e.target.value })}
          className="w-1/3 px-2 py-1 border border-gray-300 rounded"
        />
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => handleUpdateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
          min="1"
          className="w-16 px-2 py-1 border border-gray-300 rounded"
        />
      </div>
      <button
        onClick={() => handleDeleteItem(item.id)}
        className="ml-2 text-red-500 hover:text-red-700"
      >
        <X size={18} />
      </button>
    </div>
  );

  // Render date view
  const renderDateView = () => (
    <div>
      {/* Unassigned items */}
      <div className="p-4 rounded-lg mb-6 border-2 border-dashed border-gray-300 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Unassigned Items</h3>
          <button
            onClick={() => setShowAddItemForm({ type: 'unassigned' })}
            className="bg-blue-600 text-white flex items-center px-3 py-1 rounded-md hover:bg-blue-700"
          >
            <Plus size={20} className="mr-1" />
            Add Item
          </button>
        </div>
        
        {showAddItemForm && showAddItemForm.type === 'unassigned' && renderAddItemForm('unassigned')}
        
        <div className="space-y-2">
          {getUnassignedItems().map(item => renderItem(item))}
          {getUnassignedItems().length === 0 && !showAddItemForm && (
            <div className="text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-md">
              No unassigned items
            </div>
          )}
        </div>
      </div>

      {/* Display by date */}
      {dates.map(date => {
        const { dateActivities, dateItemsNoActivity } = getItemsAndActivitiesByDate(date);
        
        return (
          <div key={date} className="mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">{date}</h3>
              <button
                onClick={() => setShowAddActivityForm(date)}
                className="bg-green-600 text-white flex items-center px-3 py-1 rounded-md hover:bg-green-700"
              >
                <Plus size={18} className="mr-1" />
                Add Activity
              </button>
            </div>
            
            <div className="p-4">
              {showAddActivityForm === date && renderAddActivityForm(date)}
              
              {/* Activities list */}
              <div className="space-y-4 mb-4">
                {dateActivities.map(activity => {
                  const activityItems = items.filter(item => item.activityId === activity.id);
                  
                  return (
                    <div key={activity.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <h5 className="font-medium">{activity.name}</h5>
                          {activity.startTime && (
                            <div className="ml-3 flex items-center text-sm text-gray-600">
                              <Clock size={14} className="mr-1" />
                              {activity.startTime}
                              {activity.endTime && ` - ${activity.endTime}`}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => setShowAddItemForm({ type: 'activity', id: activity.id })}
                            className="bg-blue-600 text-white flex items-center mr-2 px-3 py-1 rounded-md hover:bg-blue-700"
                          >
                            <Plus size={18} className="mr-1" />
                            Add Item
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {showAddItemForm && showAddItemForm.type === 'activity' && showAddItemForm.id === activity.id && renderAddItemForm('activity', activity.id)}
                      
                      <div className="p-2 rounded-lg border border-dashed border-gray-300">
                        <div className="space-y-2">
                          {activityItems.map(item => renderItem(item))}
                          {activityItems.length === 0 && !showAddItemForm && (
                            <div className="text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-md">
                              No items for this activity
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Items without activities */}
              <div className="mb-4 p-3 rounded-lg border border-dashed border-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium">Items Not Assigned to Activities</h4>
                  <button
                    onClick={() => setShowAddItemForm({ type: 'date', id: date })}
                    className="bg-blue-600 text-white flex items-center px-3 py-1 rounded-md hover:bg-blue-700"
                  >
                    <Plus size={18} className="mr-1" />
                    Add Item
                  </button>
                </div>
                
                {showAddItemForm && showAddItemForm.type === 'date' && showAddItemForm.id === date && renderAddItemForm('date', date)}
                
                <div className="space-y-2 mb-2">
                  {dateItemsNoActivity.map(item => renderItem(item))}
                  {dateItemsNoActivity.length === 0 && !showAddItemForm && (
                    <div className="text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-md">
                      No items for this date
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Render category view
  const renderCategoryView = () => {
    const itemsByCategory = getItemsByCategory();
    
    return (
      <div>
        {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
          <div key={category} className="mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">{category || 'Uncategorized'}</h3>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {categoryItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center bg-white p-3 rounded-md shadow-sm border border-gray-200"
                  >
                    <div className="flex flex-1 items-center space-x-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                        min="1"
                        className="w-16 px-2 py-1 border border-gray-300 rounded"
                      />
                      {item.date && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {item.date}
                        </span>
                      )}
                      {item.activityId && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {activities.find(a => a.id === item.activityId)?.name}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('date')}
            className={`flex items-center px-4 py-2 rounded-md ${
              viewMode === 'date'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar size={18} className="mr-2" />
            Date View
          </button>
          <button
            onClick={() => setViewMode('category')}
            className={`flex items-center px-4 py-2 rounded-md ${
              viewMode === 'category'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Grid size={18} className="mr-2" />
            Category View
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {tripInfo && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">{tripInfo.tripName}</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium">{tripInfo.destination.label}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dates</p>
                  <p className="font-medium">{tripInfo.startDate} to {tripInfo.endDate}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <h2 className="text-2xl font-bold mb-6">Packing List</h2>
        {viewMode === 'date' ? renderDateView() : renderCategoryView()}
      </div>
    </div>
  );
}

export default PackingList; 