from .dbConnection import pool

class DB:
    # provide connections from the pool object to the methods that need to execute queries
    def get_connection(self):
        return pool.connection()
    
    # execute queries and return many results
    def get_many(self,query,params=None):
        # actually getting a connection from the pool and executing the query
        with self.get_connection() as connection:
            with connection.cursor () as cursor:
                cursor.execute(query,params)
                return cursor.fetchall()
            
    # execute queries and return one result
    def get_one(self,query,params=None):
        # actually getting a connection from the pool and executing the query
        with self.get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(query,params)
                return cursor.fetchone()
    
            
    # execute update and delete queries both and return no result
    def modify(self,query,params=None):
        # actually getting a connection from the pool and executing the query
        with self.get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(query,params)
    
   
            
        