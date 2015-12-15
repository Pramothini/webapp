def get_report():
    #url = 'http://api.example.com/books' 
    #params = {'year': year, 'author': author}
    results = requests.get('reportAPI')
    #r = requests.get('reportAPI')
    results_1 = results.json()
    results_2 = {'results':results_1['results']}

def get_books(year, author):
    url = 'http://api.example.com/books' 
    params = {'year': year, 'author': author}
    r = requests.get('http://api.example.com/books', params)
    books = r.json()
    books_list = {'books':books['results']}

