import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
    tagTypes: ['Todos'],
    endpoints: (builder) => ({
        getTodos: builder.query({
            query: () => '/todos',
            transformResponse: res => res.sort((a,b) => b.id - a.id),
            providesTags: ['Todos']
        }),
        addTodo: builder.mutation({
            query: (todo) => ({
                url: '/todos',
                method: 'POST',
                body: todo
            }),
            invalidatesTags: ['Todos']
        }),
        updateTodo: builder.mutation({
            query: (todo) => ({
                url: `/todos/${todo.id}`,
                method: 'PATCH',
                body: todo
            }),
            invalidatesTags: ['Todos']
        }),
        deleteTodo: builder.mutation({
            query: ({ id }) => ({
                url: `/todos/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Todos']
        })
    })
})

export const {
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation
} = apiSlice


/* The basic structure of RTK query is: 
    We call a createSlice method and in that method we pass an object which consists of three things => 
        1) 'reducrePath': This defines the path in the Redux App where API slice is mounted. This is optional as the standard or documentation states that 'apiSlice should be inside 'api' directory inside 'features' directory'. So, if we voilate the standard then we have to define reducerPath explicitly.

        2) 'baseQuery': This can be compared to 'baseUrl' in axios. In this we use 'fetchBaseQuery' method to define base url.

        3) 'endpoints': It is url which gets attached to baseQuery and do query. endpoints accepts an arrow function which accepts 'builder' as a parameter and generates different methods.
        Like in our case, we have defined a method 'getTodos' which do query to '/todos' url.

        4) At the end we extract an auto generated hook in apiSlice by RTK Query which in this case is 'useGetTodosQuery'. In RTK query the auto genrated hook follows a naming convention which is 'use<EndpointName><Type>'.
*/

/* Now in endpoints we have 4 methods: 
    1) getTodos: The type of this method is 'query' as we are asking for some data from the api. That's why we have 'builder.query' there.
    2) addTodo, updateTodo: The type of these methods is 'mutation' as we have to modify the existing data. That'why we have 'builder.mutation' there. Both, the method accepts an argument which is 'todo'. Notice, we have a 'body' key here which is the payload we are sending back to api. Here, we have 'todo' as a payload.
    3) deleteTodo: The type of this method is also 'mutation' as we need to delete something from data. This method accepts an argument id which is destructured and passed and payload in body.
*/

/* Caching in RTK query 
    Caching is a technique used to store a copy of data so that future requests for that data can be served faster. In RTK, query caching helps to avoid unnecessary network requests by storing response from your API endpoints and reusing them when possible.
    Caching has two basic concepts:
    1) Cache: A storage location where data is kept for quick access.
    2) Invalidation: The process of marking cached data as outdated, so it gets re-fetched from the server.

    In the above I have some new statements:
    1) 'tagTypes': It is an array of tags which we are going to use. Here we have only work related to Todos so we have named the tag as 'Todos'. If we would have other work here we can add them in array seperated by comma.
    2) 'providesTags': This is always used with the methods which fetch data from the api. It is used to add that tag to the data. For example: Here, we are fetching todo data from the api, so with 'provideTags' we are marking the fecthed data as 'Todos'. This allows us to easily find and manipulate the data in cache.
    3) 'invalidatesTags': This is always used with methods which mutate data. It is used to tell the RTK Query that after adding, updating or deleting any todo, the data stored in cache is now invlaid and the query needs to fetch new data using fetching method.

    => The name 'Todos' allows to specify that for which cached data RTK query needs to perform operations.
    => If we remove all the cache handling mechanism which is 'tagTypes', 'providesTags','invalidatesTags', then we can notice that on adding, updating or deleting todo on the website does not show any UI changes.
    This is because RTK query performs auto-caching so the data fetched from API on the first call is stored in cache and then after performing those operations which manipulate the data, cache is not being updated so we see that data only which is stored in cache.
*/

/* Like Axios we have another thing which is 'transformResponse' which is used to sort the fetched data so that the newly added todo could be shown at top.
*/