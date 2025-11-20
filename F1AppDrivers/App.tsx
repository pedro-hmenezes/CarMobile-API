import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  StatusBar,
  TouchableOpacity, 
  Modal, 
  Dimensions 
} from "react-native";

type Driver = {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  team_name: string;
  name_acronym: string;
  headshot_url: string | null;
  team_colour: string;
  country_code: string;
};

const API_URL = "https://api.openf1.org/v1/drivers?session_key=9472";
const { width } = Dimensions.get('window');

export default function App() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  async function load() {
    try {
      if (!loading) setRefreshing(true);
      const res = await fetch(API_URL);
      const data = await res.json();

      const uniqueDriversMap = new Map();
      data.forEach((item: any) => {
        if (!uniqueDriversMap.has(item.driver_number)) {
            uniqueDriversMap.set(item.driver_number, item);
        }
      });

      const uniqueDriversList = Array.from(uniqueDriversMap.values());
      uniqueDriversList.sort((a: any, b: any) => a.team_name.localeCompare(b.team_name));
      setDrivers(uniqueDriversList as Driver[]);

    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filteredDrivers = search
    ? drivers.filter((d) => 
        d.full_name.toLowerCase().includes(search.toLowerCase()) ||
        d.team_name.toLowerCase().includes(search.toLowerCase())
      )
    : drivers;

  const getTeamColor = (colorHex: string) => colorHex ? `#${colorHex}` : "#333";
  const getCountryIso2 = (code: string) => {
    const mapping: Record<string, string> = {
        'GBR': 'gb', 'ESP': 'es', 'MCO': 'mc', 'NLD': 'nl', 'MEX': 'mx', 
        'AUS': 'au', 'FIN': 'fi', 'FRA': 'fr', 'DEU': 'de', 'JPN': 'jp', 
        'CHN': 'cn', 'CAN': 'ca', 'THA': 'th', 'DNK': 'dk', 'USA': 'us', 
        'BRA': 'br', 'ITA': 'it'
    };
    return mapping[code] || 'un';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FF1801" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F7F9" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>F1 Grid 2024</Text>
      </View>

      <TextInput
        placeholder="Buscar piloto..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      <FlatList
        data={filteredDrivers}
        keyExtractor={(item) => String(item.driver_number)}
        onRefresh={load}
        refreshing={refreshing}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => setSelectedDriver(item)}
          >
            <View style={[styles.card, { borderLeftColor: getTeamColor(item.team_colour) }]}>
              <View style={styles.imageContainer}>
                  {item.headshot_url ? (
                      <Image source={{ uri: item.headshot_url }} style={styles.headshot} />
                  ) : (
                      <Text style={styles.driverNumber}>#{item.driver_number}</Text>
                  )}
              </View>
              <View style={styles.infoContainer}>
                  <Text style={styles.broadcastName}>{item.broadcast_name}</Text>
                  <Text style={[styles.teamName, { color: getTeamColor(item.team_colour) }]}>
                      {item.team_name}
                  </Text>
              </View>
              <View style={styles.rightContainer}>
                  <Text style={styles.acronym}>{item.name_acronym}</Text>
                  <Image 
                      source={{ uri: `https://flagcdn.com/48x36/${getCountryIso2(item.country_code)}.png` }}
                      style={styles.flag}
                  />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType="slide" 
        transparent={true} 
        visible={selectedDriver !== null} 
        onRequestClose={() => setSelectedDriver(null)} 
      >
        <View style={styles.modalOverlay}>
          {selectedDriver && (
            <View style={styles.modalContent}>
                
                <View style={[styles.modalHeader, { backgroundColor: getTeamColor(selectedDriver.team_colour) }]}>
                    <Text style={styles.modalAcronym}>{selectedDriver.name_acronym}</Text>
                    <Text style={styles.modalNumber}>#{selectedDriver.driver_number}</Text>
                </View>

                <View style={styles.modalImageContainer}>
                     {selectedDriver.headshot_url ? (
                        <Image source={{ uri: selectedDriver.headshot_url }} style={styles.modalImage} />
                     ) : (
                        <View style={{height: 200, justifyContent: 'center'}}><Text>Sem Foto</Text></View>
                     )}
                </View>

                <View style={styles.modalBody}>
                    <Text style={styles.modalFullName}>{selectedDriver.full_name}</Text>
                    <Text style={styles.modalTeam}>{selectedDriver.team_name}</Text>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>País</Text>
                            <Image 
                                source={{ uri: `https://flagcdn.com/48x36/${getCountryIso2(selectedDriver.country_code)}.png` }}
                                style={{ width: 30, height: 20, marginTop: 5 }}
                            />
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Número</Text>
                            <Text style={styles.statValue}>{selectedDriver.driver_number}</Text>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={[styles.closeButton, { backgroundColor: getTeamColor(selectedDriver.team_colour) }]}
                        onPress={() => setSelectedDriver(null)}
                    >
                        <Text style={styles.closeButtonText}>Fechar Ficha</Text>
                    </TouchableOpacity>
                </View>
            </View>
          )}
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7F9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 20, backgroundColor: '#fff', elevation: 2 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#000', fontStyle: 'italic' },
  input: { margin: 16, backgroundColor: "#FFF", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", fontSize: 16 },
  
  card: { backgroundColor: "#FFF", marginHorizontal: 16, marginBottom: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', elevation: 3, borderLeftWidth: 6, height: 100 },
  imageContainer: { width: 80, height: '100%', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#F3F4F6' },
  headshot: { width: '100%', height: '100%', resizeMode: 'cover', marginTop: 10 },
  driverNumber: { fontSize: 20, fontWeight: 'bold', color: '#CCC' },
  infoContainer: { flex: 1, paddingLeft: 16, justifyContent: 'center' },
  broadcastName: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  teamName: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginTop: 4 },
  rightContainer: { width: 60, alignItems: 'center', justifyContent: 'center', paddingRight: 16 },
  acronym: { fontSize: 24, fontWeight: '900', color: '#E5E7EB', position: 'absolute', zIndex: 0 },
  flag: { width: 24, height: 18, borderRadius: 2, marginTop: 20, zIndex: 1 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  modalAcronym: { fontSize: 30, fontWeight: '900', color: 'rgba(255,255,255,0.4)' },
  modalNumber: { fontSize: 30, fontWeight: '900', color: '#FFF' },
  modalImageContainer: { alignItems: 'center', marginTop: -20, zIndex: 1 },
  modalImage: { width: 200, height: 200, resizeMode: 'contain' },
  modalBody: { padding: 20, alignItems: 'center' },
  modalFullName: { fontSize: 22, fontWeight: 'bold', color: '#111', textAlign: 'center' },
  modalTeam: { fontSize: 16, color: '#666', marginBottom: 15 },
  divider: { height: 1, width: '100%', backgroundColor: '#EEE', marginBottom: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#999', textTransform: 'uppercase' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 5 },
  closeButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  closeButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});