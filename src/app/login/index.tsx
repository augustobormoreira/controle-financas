import loginInfo from "@/lib/login_info";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import styles from "./style.login";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userOrEmailWrong, setUserOrEmailWrong] = useState(false);

  const handleLoginSubmit = () => {
    const userEmail = loginInfo.email;
    const userPw = loginInfo.senha;
    if (userEmail === email && password === userPw) {
      router.push("../dashboard");
    } else {
      setUserOrEmailWrong(true);
    }
  };

  return (
    <View style={styles.loginFormContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Bem vindo ao Finances!</Text>

        <Text>Login:</Text>
        <TextInput
          style={styles.textInputStyling}
          data-test-id="formLoginTest"
          onChangeText={setEmail}
        />

        <Text>Senha:</Text>
        <TextInput
          secureTextEntry
          style={styles.textInputStyling}
          data-test-id="formSenhaTest"
          onChangeText={setPassword}
        />
        {userOrEmailWrong && (
          <Text style={styles.errorMessage}>Email ou senha incorretos!</Text>
        )}
        <Text>Não possui Login? Clique aqui para se registrar!</Text>

        <Pressable
          data-test-id="formSubmitTest"
          style={styles.submitButton}
          onPress={handleLoginSubmit}
        >
          <Text style={styles.submitButtonText}>Entrar</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;
