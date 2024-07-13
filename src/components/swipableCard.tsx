import { useState, useEffect, Children, cloneElement } from 'react';
import TinderCard from 'react-tinder-card';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

export function SwipableCard({
                               imageSrc,
                               title,
                               description,
                               forceLoading,
                               onSwipe,
                               onCardLeftScreen,
                               style,
                             }) {
  const [isLoading, setIsLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState('');

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => setIsLoading(false);

    setTimeout(() => {
      if(isLoading) {
        setIsLoading(false);
        // The image failed to load, so replace it with a gray box
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
        img.onload = () => setIsLoading(false);
      }
    }, 5000);
  }, [imageSrc]);

  const triggerSwipe = (direction) => {
    setSwipeDirection(direction);
    onSwipe(direction);
  };

  return (
    <motion.div
      initial={{ scale: 1, x: 0 }}
      animate={{ x: 0 }}
      exit={{
        x: swipeDirection === 'left' ? -300 : 300,
        opacity: 0,
        transition: { duration: 0.5 }
      }}
      transition={{ duration: 0.5 }}
    >
      <div style={style} className="w-[325px]">
        <TinderCard
          onSwipe={isLoading ? () => {} : onSwipe}
          onCardLeftScreen={onCardLeftScreen}
          className="w-full bg-white"
        >
          <Card className="w-full bg-white rounded-md">
              {isLoading || forceLoading ? (
                <>
                  <Skeleton className="w-full h-[300px] rounded-none" />
                  <CardContent>
                    <Skeleton className="w-full h-[24px] rounded-full mt-2" />
                    <Skeleton className="w-full h-[16px] rounded-md mt-2" />
                    <div className="flex items-center justify-between mt-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                  </CardContent>
                </>
              ) : (
                <>
                  <div
                    style={{
                      backgroundImage: `url(${imageSrc})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderTopLeftRadius: '0.375rem',
                      borderTopRightRadius: '0.375rem',
                    }}
                    className="w-full border-b h-[375px] w-[325px] rounded-none"
                  />
                  <CardContent className="mt-4">
                    <div className="grid gap-2">
                      <h3 className="text-xl font-bold">{title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between px-4 mt-6">
                      <Button variant="ghost" size="icon" onClick={() => triggerSwipe('left')}>
                        <FaThumbsDown className="w-5 h-5 fill-muted-foreground" />
                        <span className="sr-only">Dislike</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => triggerSwipe('right')}>
                        <FaThumbsUp className="w-5 h-5 fill-primary" />
                        <span className="sr-only">Like</span>
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}
          </Card>
        </TinderCard>
      </div>
    </motion.div>
  );
}

export function CardStack({ children, forceLoading, onSwipeCallback }) {
  const [cards, setCards] = useState(Children.toArray(children));
  const [swipedCards, setSwipedCards] = useState(0);

  useEffect(() => {
    setCards(Children.toArray(children));
  }, [children]);

  const handleSwipe = (direction, index) => {
    onSwipeCallback(direction, swipedCards + 1);
    setSwipedCards(prev => prev + 1);

    // Delay the removal of the card from the stack
    setTimeout(() => {
      setCards(prevCards => prevCards.filter((_, i) => i !== index));
    }, 200); // 200 milliseconds delay
  };

  return (
    <div className="w-[350px] h-[350px]">
      <AnimatePresence>
        {cards.map((child, i) => (
          cloneElement(child, {
            onSwipe: (direction) => handleSwipe(direction, i),
            forceLoading,
            key: child.key,
            style: {
              position: 'absolute',
              transform: `scale(${1 - i * 0.05}) translateY(-${i * 25}px)`,
              zIndex: -i,
              transition: 'transform 0.5s, opacity 0.5s',
              display: i > 20 ? 'none' : 'block',
            }
          })
        )).reverse()}
      </AnimatePresence>
    </div>
  );
}