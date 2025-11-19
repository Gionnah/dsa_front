import React, { useRef, useState, useEffect, ReactNode, MouseEventHandler, UIEvent } from 'react';
import { motion, useInView } from 'motion/react';

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
  isSelected?: boolean;
  data?: any;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ 
  children, 
  delay = 0, 
  index, 
  onMouseEnter, 
  onMouseLeave,
  onClick, 
  isSelected = false 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  items?: number[];
  onItemSelect?: (item: number, index: number) => void;
  selectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  data?: any;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items = [1, 2],
  onItemSelect,
  selectedIndex = -1,
  onSelectedIndexChange,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  data = []
}) => {
  const test_list = items?.map((testCase: any, index: number) => `Test Case ${index + 1}`) || [];
  const listRef = useRef<HTMLDivElement>(null);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);
  
  console.log(data);

  // Fonction pour trouver le résultat du test correspondant à l'index
  const getTestResult = (index: number) => {
    if (!data || !data.results || !Array.isArray(data.results) || data.results.length < test_list?.length) {
      return null;
    }

    // Cherche le résultat avec le test_number correspondant (index + 1)
    // Cela fonctionne pour les deux cas : un seul test ou tous les tests
    const result = data.results.find((r: any) => r.test_number === index + 1);
    
    return result || null;
  };

  // Fonction pour déterminer la couleur selon le résultat du test
  const getTestStatusColor = (index: number) => {
    const testResult = getTestResult(index);
    
    if (!testResult) {
      return 'bg-[#111]'; // Couleur par défaut si pas de données
    }

    if (testResult.passed) {
      return 'bg-green-900/30 border-green-500'; // Vert pour test réussi
    } else {
      return 'bg-red-900/30 border-red-500'; // Rouge pour test échoué
    }
  };

  // Fonction pour déterminer la couleur au survol
  const getHoverColor = (index: number) => {
    const testResult = getTestResult(index);
    
    if (!testResult) {
      return 'hover:bg-[#1a1a1a]';
    }

    if (testResult.passed) {
      return 'hover:bg-green-800/40';
    } else {
      return 'hover:bg-red-800/40';
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (index: number) => {
    const testResult = getTestResult(index);
    
    if (!testResult) {
      return 'Run TEST';
    }

    return testResult.passed ? '✓ PASSED' : '✗ FAILED';
  };

  // Fonction pour obtenir la couleur du texte du statut
  const getStatusTextColor = (index: number) => {
    const testResult = getTestResult(index);
    
    if (!testResult) {
      return 'text-gray-400';
    }

    return testResult.passed ? 'text-green-400' : 'text-red-400';
  };

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  };

  // Reset selection quand la souris quitte la liste
  const handleMouseLeave = () => {
    setIsHovering(false);
    if (!keyboardNav) {
      onSelectedIndexChange?.(-1);
    }
  };

  // Gestion améliorée de la navigation clavier
  useEffect(() => {
    if (!enableArrowNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setIsHovering(false);
        const newIndex = selectedIndex < 0 ? 0 : Math.min(selectedIndex + 1, items.length - 1);
        onSelectedIndexChange?.(newIndex);
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setIsHovering(false);
        const newIndex = selectedIndex < 0 ? items.length - 1 : Math.max(selectedIndex - 1, 0);
        onSelectedIndexChange?.(newIndex);
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      } else if (e.key === 'Escape') {
        onSelectedIndexChange?.(-1);
        setKeyboardNav(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation, onSelectedIndexChange]);

  // Scroll vers l'élément sélectionné
  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null;
    
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;

      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex, keyboardNav]);

  // Reset keyboardNav après un délai d'inactivité
  useEffect(() => {
    if (!keyboardNav) return;

    const timeout = setTimeout(() => {
      setKeyboardNav(false);
    }, 2000); // Reset après 2 secondes d'inactivité

    return () => clearTimeout(timeout);
  }, [keyboardNav, selectedIndex]);

  return (
    <div 
      className={`relative w-[380px] min-h-full ${className}`}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovering(true)}
    >
      <div
        ref={listRef}
        className={`max-h-[200px] overflow-y-auto py-4 px-2 ${
          displayScrollbar
            ? '[&::-webkit-scrollbar-track]:bg-[#060010] [&::-webkit-scrollbar-thumb]:bg-[#222]'
            : 'scrollbar-hide'
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: displayScrollbar ? 'thin' : 'none',
          scrollbarColor: '#222 #060010'
        }}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            isSelected={selectedIndex === index}
            onMouseEnter={() => {
              setIsHovering(true);
              onSelectedIndexChange?.(index);
            }}
            onMouseLeave={() => {
              if (isHovering && !keyboardNav) {
                onSelectedIndexChange?.(-1);
              }
            }}
            onClick={() => {
              onSelectedIndexChange?.(index);
              setKeyboardNav(false);
              if (onItemSelect) {
                onItemSelect(item, index);
              }
            }}
          >
            <div 
              className={`flex items-center justify-between px-4 py-2 transition-all duration-200 border-l-2 ${
                selectedIndex === index 
                  ? 'bg-[#222] border-blue-500' 
                  : `${getTestStatusColor(index)} ${getHoverColor(index)}`
              } ${itemClassName}`}
            >
              <p className='bg-neutral-600/20 py-4 px-6'>{index + 1}</p>
              <p className="text-white m-0">Test {index + 1}</p>
              <p className={`py-4 px-6 border ${getStatusTextColor(index)} font-semibold`}>
                {getStatusText(index)}
              </p>
            </div>
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div
            className="absolute min-h-full top-0 left-0 right-0 h-[50px] bg-linear-to-b from-black to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: topGradientOpacity }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] bg-linear-to-t from-black to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: bottomGradientOpacity }}
          />
        </>
      )}
    </div>
  );
};

export default AnimatedList;