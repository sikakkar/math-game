import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase, type Profile } from "../lib/supabase";
import { useGame } from "../lib/context";

export default function ProfilePicker() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTrack, setNewTrack] = useState<Profile["track"]>("addition_subtraction");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { selectProfile } = useGame();
  const router = useRouter();

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at");
    setProfiles(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handlePick = async (profile: Profile) => {
    await selectProfile(profile);
    router.push("/game");
  };

  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    await supabase.from("profiles").insert({ name: trimmed, track: newTrack });
    setShowForm(false);
    setNewName("");
    setNewTrack("addition_subtraction");
    await fetchProfiles();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("progress").delete().eq("profile_id", id);
    await supabase.from("profiles").delete().eq("id", id);
    setConfirmDeleteId(null);
    await fetchProfiles();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who's playing?</Text>
      <View style={styles.cards}>
        {profiles.map((p) => (
          <View key={p.id}>
            <Pressable
              style={[
                styles.card,
                p.track === "multiplication"
                  ? styles.cardOrange
                  : styles.cardPurple,
              ]}
              onPress={() => handlePick(p)}
              onLongPress={() => setConfirmDeleteId(p.id)}
            >
              <Text style={styles.cardName}>{p.name}</Text>
              <Text style={styles.cardTrack}>
                {p.track === "multiplication"
                  ? "Multiplication"
                  : "Add & Subtract"}
              </Text>
            </Pressable>
            {confirmDeleteId === p.id && (
              <View style={styles.deleteOverlay}>
                <Text style={styles.deleteText}>Delete {p.name}?</Text>
                <View style={styles.formButtons}>
                  <Pressable
                    style={[styles.btn, styles.btnDanger]}
                    onPress={() => handleDelete(p.id)}
                  >
                    <Text style={styles.btnText}>Delete</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.btn, styles.btnCancel]}
                    onPress={() => setConfirmDeleteId(null)}
                  >
                    <Text style={styles.btnText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ))}

        {showForm ? (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Player name"
              placeholderTextColor="#999"
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <View style={styles.trackPicker}>
              <Pressable
                style={[
                  styles.trackOption,
                  newTrack === "addition_subtraction" && styles.trackOptionSelectedPurple,
                ]}
                onPress={() => setNewTrack("addition_subtraction")}
              >
                <Text
                  style={[
                    styles.trackOptionText,
                    newTrack === "addition_subtraction" && styles.trackOptionTextSelected,
                  ]}
                >
                  Add & Subtract
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.trackOption,
                  newTrack === "multiplication" && styles.trackOptionSelectedOrange,
                ]}
                onPress={() => setNewTrack("multiplication")}
              >
                <Text
                  style={[
                    styles.trackOptionText,
                    newTrack === "multiplication" && styles.trackOptionTextSelected,
                  ]}
                >
                  Multiplication
                </Text>
              </Pressable>
            </View>
            <View style={styles.formButtons}>
              <Pressable
                style={[styles.btn, styles.btnCreate]}
                onPress={handleCreate}
              >
                <Text style={styles.btnText}>Create</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.btnCancel]}
                onPress={() => {
                  setShowForm(false);
                  setNewName("");
                  setNewTrack("addition_subtraction");
                }}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1E1B4B",
    marginBottom: 48,
  },
  cards: {
    gap: 24,
    width: "100%",
    maxWidth: 320,
  },
  card: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
  },
  cardPurple: {
    backgroundColor: "#6C63FF",
  },
  cardOrange: {
    backgroundColor: "#FF8C42",
  },
  cardName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  cardTrack: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
  },
  addButton: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#6C63FF",
    borderStyle: "dashed",
    padding: 20,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#6C63FF",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: "#E0D8FF",
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: "#1E1B4B",
  },
  trackPicker: {
    flexDirection: "row",
    gap: 12,
  },
  trackOption: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0D8FF",
    padding: 12,
    alignItems: "center",
  },
  trackOptionSelectedPurple: {
    backgroundColor: "#6C63FF",
    borderColor: "#6C63FF",
  },
  trackOptionSelectedOrange: {
    backgroundColor: "#FF8C42",
    borderColor: "#FF8C42",
  },
  trackOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E1B4B",
  },
  trackOptionTextSelected: {
    color: "#fff",
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  btnCreate: {
    backgroundColor: "#6C63FF",
  },
  btnCancel: {
    backgroundColor: "#9CA3AF",
  },
  btnDanger: {
    backgroundColor: "#EF4444",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  deleteOverlay: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    alignItems: "center",
    gap: 12,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E1B4B",
  },
});
