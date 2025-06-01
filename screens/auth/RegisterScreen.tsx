
import { useState } from "react"
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { TextInput, Button, Text, SegmentedButtons } from "react-native-paper"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigation } from "@react-navigation/native"
import * as Animatable from "react-native-animatable"

const RegisterScreen = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userType, setUserType] = useState<"client" | "agency">("client")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { register } = useAuth()
  const navigation = useNavigation()

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs")
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setLoading(true)
    setError("")

    try {
      await register(email, password, name, userType)
    } catch (err) {
      setError("Échec de l'inscription. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={800} style={styles.formContainer}>
        <Text style={styles.title}>Inscription</Text>

        <SegmentedButtons
          value={userType}
          onValueChange={(value) => setUserType(value as "client" | "agency")}
          buttons={[
            { value: "client", label: "Client" },
            { value: "agency", label: "Agence" },
          ]}
          style={styles.segmentedButtons}
        />

        <TextInput
          label="Nom"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="account" />}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="email" />}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
          left={<TextInput.Icon icon="lock" />}
        />

        <TextInput
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
          left={<TextInput.Icon icon="lock-check" />}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          style={styles.registerButton}
          contentStyle={styles.buttonContent}
        >
          S'inscrire
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate("Login" as never)} style={styles.loginLink}>
          <Text style={styles.loginText}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </Animatable.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  registerButton: {
    marginTop: 10,
    backgroundColor: "#FF6B00",
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#FF6B00",
  },
})

export default RegisterScreen
