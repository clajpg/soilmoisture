// ThingSpeak REST API Service & Configuration Manager

const STORAGE_KEY = 'soil_moisture_config_v1';

export const DEFAULT_CONFIG = {
  channelId: '', // Default empty (triggers demo mode until user enters Channel ID)
  readApiKey: '',
  resultsCount: 30,
  autoRefreshInterval: 20, // seconds
  sensorNames: [
    'Sensor 1 (Pin 32)',
    'Sensor 2 (Pin 33)',
    'Sensor 3 (Pin 34)',
    'Sensor 4 (Pin 35)',
    'Sensor 5 (Pin 25)',
    'Sensor 6 (Pin 26)'
  ],
  thresholds: {
    dry: 30,    // Below 30% = Kering (Dry - Needs Water)
    wet: 75     // Above 75% = Sangat Basah (Wet)
  }
};

// Retrieve configuration from LocalStorage
export function loadConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_CONFIG;
    const parsed = JSON.parse(saved);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      thresholds: { ...DEFAULT_CONFIG.thresholds, ...parsed.thresholds },
      sensorNames: parsed.sensorNames?.length === 6 ? parsed.sensorNames : DEFAULT_CONFIG.sensorNames
    };
  } catch (err) {
    console.error('Failed to load settings from localStorage:', err);
    return DEFAULT_CONFIG;
  }
}

// Save configuration to LocalStorage
export function saveConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

// Generate realistic simulated mock data for demonstration when no API key/channel ID is supplied
export function generateMockFeeds(count = 20) {
  const feeds = [];
  const now = Date.now();
  const intervalMs = 20 * 1000; // 20 seconds matching ESP32 TS_INTERVAL_MS

  // Base percentages for 6 sensors to make realistic curves
  let baseVals = [28, 45, 62, 18, 55, 78];

  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now - i * intervalMs);
    const feed = {
      created_at: time.toISOString(),
      entry_id: 1000 + (count - i)
    };

    baseVals = baseVals.map((val) => {
      const delta = (Math.random() - 0.48) * 3;
      const newVal = Math.min(100, Math.max(5, val + delta));
      return parseFloat(newVal.toFixed(1));
    });

    for (let s = 0; s < 6; s++) {
      feed[`field${s + 1}`] = String(baseVals[s]);
    }
    feeds.push(feed);
  }

  return {
    channel: {
      id: 999999,
      name: "ESP32 Soil Moisture Monitoring (Demo)",
      description: "6-Channel Soil Moisture Monitoring System via ESP32 ADC1",
      field1: "Sensor 1",
      field2: "Sensor 2",
      field3: "Sensor 3",
      field4: "Sensor 4",
      field5: "Sensor 5",
      field6: "Sensor 6",
      updated_at: new Date().toISOString()
    },
    feeds: feeds,
    isMock: true
  };
}

// Fetch real data from ThingSpeak REST API
export async function fetchThingSpeakFeeds(channelId, readApiKey, resultsCount = 30) {
  if (!channelId) {
    // Return mock data if no Channel ID is configured yet
    return generateMockFeeds(resultsCount);
  }

  const apiKeyParam = readApiKey ? `&api_key=${encodeURIComponent(readApiKey)}` : '';
  const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?results=${resultsCount}${apiKeyParam}`;

  try {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`ThingSpeak returned status ${response.status}`);
    }
    const data = await response.json();
    return {
      ...data,
      isMock: false
    };
  } catch (error) {
    console.warn(`Failed to fetch ThingSpeak channel ${channelId}, falling back to mock data:`, error.message);
    const mock = generateMockFeeds(resultsCount);
    mock.fetchError = error.message;
    return mock;
  }
}

// Determine moisture level category & color styling
export function getMoistureStatus(percent, thresholds = DEFAULT_CONFIG.thresholds) {
  if (percent === null || percent === undefined || isNaN(percent)) {
    return {
      label: 'Tidak ada data',
      code: 'UNKNOWN',
      textClass: 'text-slate-400',
      colorClass: 'text-slate-400',
      bgClass: 'bg-slate-500/10',
      borderClass: 'border-slate-500/20',
      badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
      gaugeColor: '#64748b'
    };
  }

  if (percent < thresholds.dry) {
    return {
      label: 'Kering',
      code: 'DRY',
      textClass: 'text-amber-500',
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-500/10',
      borderClass: 'border-amber-500/30',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      gaugeColor: '#f59e0b'
    };
  }

  if (percent > thresholds.wet) {
    return {
      label: 'Sangat Basah',
      code: 'WET',
      textClass: 'text-cyan-500',
      colorClass: 'text-cyan-400',
      bgClass: 'bg-cyan-500/10',
      borderClass: 'border-cyan-500/30',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      gaugeColor: '#06b6d4'
    };
  }

  return {
    label: 'Optimal',
    code: 'OPTIMAL',
    textClass: 'text-sky-500',
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/30',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    gaugeColor: '#10b981'
  };
}
