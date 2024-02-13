import { createContext, useReducer } from 'react';
import { useContext, useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:8000'

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {}
}

const reducer = (state, action) => {
  switch(action.type) {
    
    case 'loading':
      return {
        ...state,
        isLoading: true
      }
    
    case 'cities/loaded':
      return{
        ...state,
        isLoading: false,
        cities: action.payload
      }
    case 'city/loaded': 
    return {
      ...state,
      isLoading: false,
      currentCity: action.payload
    }
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload
      }
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) =>{ return city.id !==  action.payload}),
        currentCity: {}
      }
    case 'rejected': {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    }

    default:
      throw new Error("Unknown action type");

  }
}

function CitiesProvider (prop) {
    
    
    const { children } = prop;

    const [{cities, isLoading, currentCity, error}, dispatch] = useReducer(reducer, initialState)
  
  
    useEffect(() => {
      async function fetchCities(){
        dispatch({type:"loading"})
        try {
          const res = await fetch(`${BASE_URL}/cities`)
          const data = await res.json();
          dispatch({type:'cities/loaded', payload: data})
        } catch(err) {
          dispatch({type: 'rejected', payload:"There was an error in loading cities data."})
        }
      } 
      fetchCities();
      }, []) 
      
      async function getCity(id) {
        if(Number(id) === currentCity.id) return;
        dispatch({type:"loading"})
          try {
            const res = await fetch(`${BASE_URL}/cities/${id}`)
            const data = await res.json();
            dispatch({type:'city/loaded', payload: data});
          } catch(err) {
            dispatch({type: 'rejected', payload:"Error in loading city data..."})
          }
        }
        
        async function createCity(newCity) {
          dispatch({type:"loading"})
          try {
            const res = await fetch(`${BASE_URL}/cities`, {
              method: 'POST',
              body: JSON.stringify(newCity),
              headers: {
                'Content-Type': "application/json"
              }
            })
            const data = await res.json();
            dispatch({type:'city/created', payload:data})
          } catch(err) {
            dispatch({type: 'rejected', payload:"Error in creating city data..."})
          }
        }
        
    async function deleteCity(id) {
      dispatch({type:"loading"})
      try {
        await fetch(`${BASE_URL}/cities/${id}`, {
          method: 'DELETE',
        })
        dispatch({type: 'city/deleted', payload: id})
      } catch(err) {
        dispatch({type: 'rejected', payload:"Error in deleting city data..."})
      }
  }

      return (
        <CitiesContext.Provider value={{cities, isLoading, currentCity, getCity, createCity, deleteCity, error}}>{children}</CitiesContext.Provider>
      )
}

function useCities() {
    const context = useContext(CitiesContext);
    if(context === undefined)
    throw new Error("CitiesContext used outside the cities provider. ")
    return context;
}

export {
    CitiesProvider,
    useCities
}
