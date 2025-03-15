import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export async function createUser(
  username: string,
  password: string,
  email?: string,
  gender?: string,
  fullname?: string,
  travel_preferences?: string,
  item_like?:string
) {
  const response = await axios.post(`${API_URL}/signup`, {
    username,
    password,
    email,
    gender,
    fullname,
    travel_preferences,
    item_like
  });
  return response.data;
}

export async function loginUser(username: string, password: string) {
  const response = await axios.post(`${API_URL}/login`, {
    username,
    password
  });
  return response.data;
}

export async function forgotPassword(username: string) {
  const response = await axios.post(`${API_URL}/forgot-password`, {
    username
  });
  return response.data;
}

export async function updateUser(
  uid?: number,
  email?: string,
  gender?: string,
  fullname?: string,
  travel_preferences?: string,
  item_like?: string
) {
  const response = await axios.put(`${API_URL}/users/${uid}`, {
    email,
    gender,
    fullname,
    travel_preferences,
    item_like
  });
  return response.data;
}

export async function saveTravelPlan(userId: number, plan: any) {
  const response = await axios.post(`${API_URL}/travel-plans/${userId}`, {
    plan
  });
  return response.data;
}

export async function getTravelPlans(userId: number) {
  const response = await axios.get(`${API_URL}/travel-plans/${userId}`);
  return response.data;
}