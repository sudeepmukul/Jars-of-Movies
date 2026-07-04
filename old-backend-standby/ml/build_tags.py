import pandas as pd
import ast

movies = pd.read_csv(
    "../datasets/movies_metadata.csv",
    low_memory=False
)

credits = pd.read_csv(
    "../datasets/credits.csv"
)

keywords = pd.read_csv(
    "../datasets/keywords.csv"
)

movies = movies[
    ['id', 'title', 'overview', 'genres']
]

movies = movies.dropna()

movies = movies[movies['id'].str.isnumeric()]

movies['id'] = movies['id'].astype(int)

credits['id'] = credits['id'].astype(int)

keywords['id'] = keywords['id'].astype(int)


movies = movies.merge(credits, on='id')

movies = movies.merge(keywords, on='id')


def convert(text):

    result = []

    try:
        for item in ast.literal_eval(text):
            result.append(item['name'])

    except:
        pass

    return result


def fetch_cast(text):

    result = []

    try:
        counter = 0

        for item in ast.literal_eval(text):

            if counter < 3:
                result.append(item['name'])

            counter += 1

    except:
        pass

    return result


def fetch_director(text):

    result = []

    try:
        for item in ast.literal_eval(text):

            if item['job'] == 'Director':
                result.append(item['name'])

    except:
        pass

    return result


movies['genres'] = movies['genres'].apply(convert)

movies['keywords'] = movies['keywords'].apply(convert)

movies['cast'] = movies['cast'].apply(fetch_cast)

movies['crew'] = movies['crew'].apply(fetch_director)

movies['overview'] = movies['overview'].apply(
    lambda x: x.split()
)

movies['tags'] = (
    movies['overview'] +
    movies['genres'] +
    movies['keywords'] +
    movies['cast'] +
    movies['crew']
)

new_df = movies[
    ['id', 'title', 'tags']
]


new_df['tags'] = new_df['tags'].apply(
    lambda x: " ".join(x)
)

new_df['tags'] = new_df['tags'].apply(
    lambda x: x.lower()
)


new_df.to_csv(
    "../datasets/clean_movies.csv",
    index=False
)

print(new_df.head())

print("\n✅ TAG BUILDING COMPLETE")