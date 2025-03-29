from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

def analyze_mood(text):
    analyzer = SentimentIntensityAnalyzer()
    sentiment = analyzer.polarity_scores(text)
    return sentiment 