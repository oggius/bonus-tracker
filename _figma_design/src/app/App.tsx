import { useState, useEffect } from 'react';
import { Star, Plus, ShoppingBag, History, Youtube, Wallet, IceCream, Film, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

type Transaction = {
  id: string;
  type: 'earn' | 'spend';
  points: number;
  description: string;
  date: string;
  reward?: 'youtube' | 'money' | 'icecream' | 'cinema' | 'zoo';
};

type Screen = 'balance' | 'add' | 'shop' | 'history';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('balance');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState('');
  const [pointsToAdd, setPointsToAdd] = useState('');

  useEffect(() => {
    const savedBalance = localStorage.getItem('pointsBalance');
    const savedTransactions = localStorage.getItem('transactions');
    if (savedBalance) setBalance(parseInt(savedBalance));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  useEffect(() => {
    localStorage.setItem('pointsBalance', balance.toString());
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [balance, transactions]);

  const addPoints = () => {
    const points = parseInt(pointsToAdd);
    if (points > 0 && description.trim()) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'earn',
        points,
        description,
        date: new Date().toISOString(),
      };
      setBalance(balance + points);
      setTransactions([newTransaction, ...transactions]);
      setPointsToAdd('');
      setDescription('');
      setCurrentScreen('balance');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const convertPoints = (type: 'youtube' | 'money' | 'icecream' | 'cinema' | 'zoo') => {
    if (balance >= 1) {
      const descriptions = {
        youtube: '30 хв YouTube',
        money: '20 грн кишенькових',
        icecream: 'Морозиво',
        cinema: 'Похід в кіно',
        zoo: 'Похід в зоопарк'
      };

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'spend',
        points: 1,
        description: descriptions[type],
        date: new Date().toISOString(),
        reward: type,
      };
      setBalance(balance - 1);
      setTransactions([newTransaction, ...transactions]);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex-1 overflow-auto"
        >
          {currentScreen === 'balance' && (
            <div className="p-6 flex flex-col items-center justify-center min-h-full">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-3xl p-8 w-full max-w-md shadow-lg border border-gray-200"
              >
                <div className="text-center mb-8">
                  <div className="text-gray-600 text-lg mb-2">Твій баланс</div>
                  <motion.div
                    key={balance}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <Star className="text-yellow-300 fill-yellow-300" size={48} />
                    <span className="text-7xl text-gray-900">{balance}</span>
                  </motion.div>
                  <div className="text-gray-500 mt-2">очок зароблено</div>
                </div>

                <button
                  onClick={() => setCurrentScreen('add')}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus size={24} />
                  <span className="text-lg">Додати очки</span>
                </button>
              </motion.div>
            </div>
          )}

          {currentScreen === 'add' && (
            <div className="p-6">
              <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-6 max-w-md mx-auto">
                <h2 className="text-gray-900 text-2xl mb-6">Додати очки</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-600 text-sm mb-2 block">Скільки очок?</label>
                    <input
                      type="number"
                      value={pointsToAdd}
                      onChange={(e) => setPointsToAdd(e.target.value)}
                      className="w-full bg-gray-50 text-gray-900 rounded-xl p-4 text-2xl text-center outline-none focus:ring-2 focus:ring-yellow-300 border border-gray-200"
                      placeholder="0"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm mb-2 block">За що?</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-gray-50 text-gray-900 rounded-xl p-4 outline-none focus:ring-2 focus:ring-yellow-300 placeholder:text-gray-400 border border-gray-200"
                      placeholder="Наприклад: зробив домашнє завдання"
                    />
                  </div>

                  <button
                    onClick={addPoints}
                    disabled={!pointsToAdd || !description.trim()}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                  >
                    Зберегти
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentScreen === 'shop' && (
            <div className="p-6">
              <h2 className="text-gray-900 text-3xl mb-6 text-center">Магазин бонусів</h2>

              <div className="space-y-4 max-w-md mx-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => convertPoints('youtube')}
                  disabled={balance < 1}
                  className="w-full bg-gradient-to-r from-red-100 to-red-200 border border-red-300 text-red-800 rounded-2xl p-6 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <Youtube className="text-red-600" size={32} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xl">30 хв YouTube</div>
                      <div className="text-gray-600 text-sm">Коштує 1 очко</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl">1</span>
                      <Star className="text-yellow-300 fill-yellow-300" size={24} />
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => convertPoints('money')}
                  disabled={balance < 1}
                  className="w-full bg-gradient-to-r from-green-100 to-emerald-200 border border-green-300 text-green-800 rounded-2xl p-6 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <Wallet className="text-green-600" size={32} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xl">20 грн кишенькових</div>
                      <div className="text-gray-600 text-sm">Коштує 1 очко</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl">1</span>
                      <Star className="text-yellow-300 fill-yellow-300" size={24} />
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => convertPoints('icecream')}
                  disabled={balance < 1}
                  className="w-full bg-gradient-to-r from-pink-100 to-pink-200 border border-pink-300 text-pink-800 rounded-2xl p-6 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <IceCream className="text-pink-600" size={32} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xl">Морозиво</div>
                      <div className="text-gray-600 text-sm">Коштує 1 очко</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl">1</span>
                      <Star className="text-yellow-300 fill-yellow-300" size={24} />
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => convertPoints('cinema')}
                  disabled={balance < 1}
                  className="w-full bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300 text-purple-800 rounded-2xl p-6 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <Film className="text-purple-600" size={32} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xl">Похід в кіно</div>
                      <div className="text-gray-600 text-sm">Коштує 1 очко</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl">1</span>
                      <Star className="text-yellow-300 fill-yellow-300" size={24} />
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => convertPoints('zoo')}
                  disabled={balance < 1}
                  className="w-full bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 text-blue-800 rounded-2xl p-6 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <Ticket className="text-blue-600" size={32} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xl">Похід в зоопарк</div>
                      <div className="text-gray-600 text-sm">Коштує 1 очко</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl">1</span>
                      <Star className="text-yellow-300 fill-yellow-300" size={24} />
                    </div>
                  </div>
                </motion.button>
              </div>

              <div className="text-center mt-6 bg-white border border-gray-200 shadow-sm rounded-2xl p-4 max-w-md mx-auto">
                <div className="text-gray-500 text-sm">Доступно очок</div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Star className="text-yellow-300 fill-yellow-300" size={24} />
                  <span className="text-gray-900 text-3xl">{balance}</span>
                </div>
              </div>
            </div>
          )}

          {currentScreen === 'history' && (
            <div className="p-6">
              <h2 className="text-gray-900 text-3xl mb-6 text-center">Історія</h2>

              <div className="space-y-3 max-w-md mx-auto">
                {transactions.length === 0 ? (
                  <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 text-center">
                    <History className="text-gray-400 mx-auto mb-3" size={48} />
                    <div className="text-gray-500">Поки що немає жодної транзакції</div>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl ${
                          transaction.type === 'earn'
                            ? 'bg-green-50'
                            : 'bg-red-50'
                        }`}>
                          {transaction.reward === 'youtube' && <Youtube className="text-red-600" size={20} />}
                          {transaction.reward === 'money' && <Wallet className="text-green-600" size={20} />}
                          {transaction.reward === 'icecream' && <IceCream className="text-pink-600" size={20} />}
                          {transaction.reward === 'cinema' && <Film className="text-purple-600" size={20} />}
                          {transaction.reward === 'zoo' && <Ticket className="text-blue-600" size={20} />}
                          {!transaction.reward && <Star className="text-yellow-300 fill-yellow-300" size={20} />}
                        </div>

                        <div className="flex-1">
                          <div className="text-gray-900">{transaction.description}</div>
                          <div className="text-gray-500 text-sm mt-1">
                            {new Date(transaction.date).toLocaleDateString('uk-UA', {
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>

                        <div className={`text-lg ${
                          transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'earn' ? '+' : '-'}{transaction.points}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <nav className="bg-white border-t border-gray-200">
        <div className="flex justify-around p-2">
          <button
            onClick={() => setCurrentScreen('balance')}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              currentScreen === 'balance'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500'
            }`}
          >
            <Star size={24} />
            <span className="text-xs">Баланс</span>
          </button>

          <button
            onClick={() => setCurrentScreen('add')}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              currentScreen === 'add'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500'
            }`}
          >
            <Plus size={24} />
            <span className="text-xs">Додати</span>
          </button>

          <button
            onClick={() => setCurrentScreen('shop')}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              currentScreen === 'shop'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500'
            }`}
          >
            <ShoppingBag size={24} />
            <span className="text-xs">Магазин</span>
          </button>

          <button
            onClick={() => setCurrentScreen('history')}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              currentScreen === 'history'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500'
            }`}
          >
            <History size={24} />
            <span className="text-xs">Історія</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
