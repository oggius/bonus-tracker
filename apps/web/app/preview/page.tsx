import {
  Star,
  Plus,
  ShoppingBag,
  History,
  Youtube,
  Wallet,
  IceCream,
  Film,
  Gamepad2,
} from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@bonus-tracker/ui";

// ---------------------------------------------------------------------------
// Static sample data
// ---------------------------------------------------------------------------
const BALANCE = 12;

const SAMPLE_TRANSACTIONS = [
  {
    id: "1",
    type: "earn" as const,
    points: 3,
    description: "Зробив домашнє завдання",
    date: "2026-05-02T18:30:00",
    reward: undefined,
  },
  {
    id: "2",
    type: "spend" as const,
    points: 1,
    description: "20 хв YouTube",
    date: "2026-05-02T15:00:00",
    reward: "youtube" as const,
  },
  {
    id: "3",
    type: "earn" as const,
    points: 5,
    description: "Прибрав кімнату",
    date: "2026-05-01T11:00:00",
    reward: undefined,
  },
  {
    id: "4",
    type: "spend" as const,
    points: 1,
    description: "Морозиво",
    date: "2026-04-30T14:00:00",
    reward: "icecream" as const,
  },
];

const REWARDS = [
  {
    id: "youtube",
    label: "20 хв YouTube",
    cost: 1,
    icon: Youtube,
    colors: "from-red-100 to-red-200 border-red-300 text-red-800",
    iconColor: "text-red-600",
  },
  {
    id: "money",
    label: "30 грн кишенькових",
    cost: 1,
    icon: Wallet,
    colors: "from-green-100 to-emerald-200 border-green-300 text-green-800",
    iconColor: "text-green-600",
  },
  {
    id: "icecream",
    label: "Морозиво",
    cost: 1,
    icon: IceCream,
    colors: "from-pink-100 to-pink-200 border-pink-300 text-pink-800",
    iconColor: "text-pink-600",
  },
  {
    id: "cinema",
    label: "Похід в кіно",
    cost: 3,
    icon: Film,
    colors: "from-purple-100 to-purple-200 border-purple-300 text-purple-800",
    iconColor: "text-purple-600",
  },
  {
    id: "gaming",
    label: "Година спільної гри",
    cost: 5,
    icon: Gamepad2,
    colors: "from-blue-100 to-indigo-200 border-indigo-300 text-indigo-800",
    iconColor: "text-indigo-600",
  },
];

function RewardIcon({ reward }: { reward?: string }) {
  const size = 20;
  if (reward === "youtube") return <Youtube className="text-red-600" size={size} />;
  if (reward === "money") return <Wallet className="text-green-600" size={size} />;
  if (reward === "icecream") return <IceCream className="text-pink-600" size={size} />;
  if (reward === "cinema") return <Film className="text-purple-600" size={size} />;
  if (reward === "gaming") return <Gamepad2 className="text-indigo-600" size={size} />;
  return <Star className="text-yellow-400 fill-yellow-400" size={size} />;
}

// ---------------------------------------------------------------------------
// Phone frame wrapper
// ---------------------------------------------------------------------------
function PhoneFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
      <div className="w-[375px] h-[720px] rounded-[40px] border-4 border-gray-300 bg-gray-50 shadow-2xl overflow-hidden flex flex-col relative">
        {children}
      </div>
    </div>
  );
}

// Bottom navigation shared by all screens
function BottomNav({ active }: { active: "balance" | "add" | "shop" | "history" }) {
  const items = [
    { id: "balance", icon: Star, label: "Баланс" },
    { id: "add", icon: Plus, label: "Додати" },
    { id: "shop", icon: ShoppingBag, label: "Магазин" },
    { id: "history", icon: History, label: "Історія" },
  ] as const;

  return (
    <nav className="bg-white border-t border-gray-200 shrink-0">
      <div className="flex justify-around p-2">
        {items.map(({ id, icon: Icon, label }) => (
          <div
            key={id}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl ${
              active === id ? "bg-gray-100 text-gray-900" : "text-gray-500"
            }`}
          >
            <Icon size={24} />
            <span className="text-xs">{label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Screen: Balance
// ---------------------------------------------------------------------------
function BalanceScreen() {
  return (
    <PhoneFrame title="Баланс">
      <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md shadow-lg rounded-3xl border-gray-200 p-8 gap-0">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg mb-2">Твій баланс</p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <Star className="text-yellow-400 fill-yellow-400" size={48} />
              <span className="text-7xl text-gray-900 font-light">{BALANCE}</span>
            </div>
            <p className="text-gray-500">очок зароблено</p>
          </div>
          <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl h-14 text-lg shadow-lg hover:shadow-xl border-0">
            <Plus size={24} />
            Додати очки
          </Button>
        </Card>
      </div>
      <BottomNav active="balance" />
    </PhoneFrame>
  );
}

// ---------------------------------------------------------------------------
// Screen: Add points
// ---------------------------------------------------------------------------
function AddScreen() {
  return (
    <PhoneFrame title="Додати очки">
      <div className="flex-1 overflow-auto p-6">
        <Card className="shadow-sm rounded-3xl border-gray-200 p-6 gap-0">
          <h2 className="text-gray-900 text-2xl mb-6">Додати очки</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-600 text-sm mb-2">Скільки очок?</Label>
              <Input
                type="number"
                defaultValue="5"
                readOnly
                className="bg-gray-50 text-gray-900 rounded-xl text-2xl text-center border-gray-200 h-14 focus-visible:ring-yellow-300"
              />
            </div>
            <div>
              <Label className="text-gray-600 text-sm mb-2">За що?</Label>
              <Input
                readOnly
                defaultValue="Прибрав кімнату"
                className="bg-gray-50 text-gray-900 rounded-xl border-gray-200 h-12 focus-visible:ring-yellow-300"
              />
            </div>
            <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl h-14 text-lg shadow-lg border-0">
              Зберегти
            </Button>
          </div>
        </Card>
      </div>
      <BottomNav active="add" />
    </PhoneFrame>
  );
}

// ---------------------------------------------------------------------------
// Screen: Shop
// ---------------------------------------------------------------------------
function ShopScreen() {
  return (
    <PhoneFrame title="Магазин">
      <div className="flex-1 overflow-auto p-6">
        <h2 className="text-gray-900 text-3xl mb-4 text-center">Магазин бонусів</h2>
        <div className="space-y-3 max-w-md mx-auto">
          {REWARDS.map(({ id, label, cost, icon: Icon, colors, iconColor }) => (
            <button
              key={id}
              className={`w-full bg-gradient-to-r ${colors} border rounded-2xl p-4 shadow-md`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/60 p-3 rounded-xl">
                  <Icon className={iconColor} size={28} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-base font-medium">{label}</div>
                  <div className="text-sm opacity-70">Коштує {cost} очко</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-semibold">{cost}</span>
                  <Star className="text-yellow-400 fill-yellow-400" size={20} />
                </div>
              </div>
            </button>
          ))}
        </div>
        <Card className="mt-4 shadow-sm rounded-2xl border-gray-200 p-4 text-center max-w-md mx-auto gap-0">
          <p className="text-gray-500 text-sm">Доступно очок</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Star className="text-yellow-400 fill-yellow-400" size={24} />
            <span className="text-gray-900 text-3xl font-light">{BALANCE}</span>
          </div>
        </Card>
      </div>
      <BottomNav active="shop" />
    </PhoneFrame>
  );
}

// ---------------------------------------------------------------------------
// Screen: History
// ---------------------------------------------------------------------------
function HistoryScreen() {
  return (
    <PhoneFrame title="Історія">
      <div className="flex-1 overflow-auto p-6">
        <h2 className="text-gray-900 text-3xl mb-4 text-center">Історія</h2>
        <div className="space-y-3 max-w-md mx-auto">
          {SAMPLE_TRANSACTIONS.map((tx) => (
            <Card key={tx.id} className="shadow-sm rounded-2xl border-gray-200 p-4 gap-0">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    tx.type === "earn" ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <RewardIcon reward={tx.reward} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate">{tx.description}</p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {new Date(tx.date).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Badge
                  variant={tx.type === "earn" ? "default" : "destructive"}
                  className={`text-base font-medium shrink-0 ${
                    tx.type === "earn"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-red-100 text-red-600 border-red-200"
                  }`}
                >
                  {tx.type === "earn" ? "+" : "-"}{tx.points}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <BottomNav active="history" />
    </PhoneFrame>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">UI Preview</h1>
          <p className="mt-2 text-gray-500">
            Static render of all four BonusTracker screens — visual fidelity check against the Figma Make prototype.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          <BalanceScreen />
          <AddScreen />
          <ShopScreen />
          <HistoryScreen />
        </div>
      </div>
    </div>
  );
}
