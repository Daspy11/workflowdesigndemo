import {useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { SwipableCard, CardStack } from "@/components/swipableCard";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;

const Search = () => {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [cardConfigs, setCardConfigs] = useState([]);

  useEffect(() => {
    if(!results) {
      return;
    }

    const cardConfigsStore = results.map((result, index) => ({
      src: result.original,
      title: result.title,
      source: result.source,
      id: index
    }))

    setCardConfigs(cardConfigsStore);
  }, [results])

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true);
    axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: apiKey,
        engine: 'google_images'
      }
    }).then((response) => {
      setLoading(false);
      setResults(response.data.images_results);
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
      setLoading(false);
      setError(error);
    });
  };

  if(error) {
    return (
      <div className="flex items-center justify-center h-screen max-w-sm mx-auto">
        <div className="flex flex-col items-center justify-center w-full h-[800px] p-4">
          <h1 className="text-3xl font-bold">API Error :(</h1>
          <p className="text-lg text-center">
            {error.message}
          </p>
          <p className="text-lg text-center mt-4">
            This error probably means either you're not running your browser with CORS disabled, or the API key isn't
            working any more.
          </p>
        </div>
      </div>
    );
  }

  console.log(!loading && !!cardConfigs)
  console.log(submitted)
  console.log("============");


  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        initial={{ y: 0, width: '50%' }}
        animate={submitted ? { y: -300, width: '90%' } : { y: 0, width: '50%' }}
        transition={{ type: 'spring', stiffness: 1500, damping: 200 }}
        className="absolute"
      >
        <form onSubmit={handleSearch} className="w-full flex justify-center">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
          />
        </form>
      </motion.div>

      {submitted && (
        <div className="flex flex-col items-center justify-center w-full h-[800px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {
              !loading && !!cardConfigs ? (
                <CardStack onSwipeCallback={(direction, id) => {
                  const cardConfig = cardConfigs[id];
                  if (direction === 'left') {
                    console.log('Swiped left on card', id, cardConfig);
                  } else {
                    console.log('Swiped right on card', id, cardConfig);
                  }}}
                >
                  {
                    cardConfigs.map((card, index) => (
                      <SwipableCard
                      key={index}
                      imageSrc={card.src}
                      title={card.title}
                      description={card.source}
                      id={card.id}
                    />
                    ))
                  }
                </CardStack>
                ) : (
                  <SwipableCard forceLoading />
              )
            }

          </motion.div>
        </div>
      )}
      <span className="absolute bottom-4 left-4 text-xs">
        helpful tip: try dragging the cards
      </span>
    </div>
  );
};

export default Search;