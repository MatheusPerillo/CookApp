import { View, Text, ScrollView, Alert } from "react-native";
import { useEffect } from "react";
import { styles } from "./styles";
import { useState } from "react";
import { Selected } from "@/components/selected";
import Ingredient from "@/components/ingredient";
import { router } from "expo-router";
import { services } from "@/services";
import { Loading } from "@/components/Loading";

export default function Index() {
  const [selected, setSelected] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function handeToggleSelected(value: string) {
    if (selected.includes(value)) {
      return setSelected((state) => state.filter((item) => item !== value));
    }

    setSelected((state) => [...state, value]);
  }

  function handleClearSelected() {
    Alert.alert("Limpar", "Deseja limpar tudo?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        onPress: () => {
          setSelected([]);
        },
      },
    ]);
  }

  function handleSearch() {
    router.navigate("/recipes/" + selected);
  }

  useEffect(() => {
    services.ingredients
      .findAll()
      .then(setIngredients)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Escolha {"\n"}
        <Text style={styles.subtitle}>os produtos</Text>
      </Text>

      <Text style={styles.message}>
        Descubra receitas baseadas nos {"\n"}
        produtos que você escolheu.
      </Text>

      <ScrollView
        contentContainerStyle={styles.ingredients}
        showsVerticalScrollIndicator={false}
      >
        {ingredients.map((item) => (
          <Ingredient
            key={item.id}
            name={item.name}
            image={`${services.storage.imagePath}/${item.image}`}
            selected={selected.includes(item.id)}
            onPress={() => handeToggleSelected(item.id)}
          />
        ))}
      </ScrollView>
      {selected.length > 0 && (
        <Selected
          quantity={selected.length}
          onClear={handleClearSelected}
          onSearch={handleSearch}
        />
      )}
    </View>
  );
}
