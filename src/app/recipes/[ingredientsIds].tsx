import { styles } from "./styles";
import { View, Text, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Recipe } from "@/components/Recipe";
import { useEffect, useState } from "react";
import { services } from "@/services";
import { Ingredients } from "@/components/Ingredients";
import { Loading } from "@/components/Loading";

export default function Recipes() {
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useLocalSearchParams<{ ingredientsIds: string }>();
  const ingredientesIds = params.ingredientsIds.split(",");

  useEffect(() => {
    services.ingredients
      .findByIds(ingredientesIds)
      .then(setIngredients)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    services.recipes
      .findByIngredientsIds(ingredientesIds)
      .then(setRecipes)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={32}
          onPress={() => router.back()}
        />
        <Text style={styles.title}>Ingredientes</Text>
      </View>

      <Ingredients ingredients={ingredients} />

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Recipe
            recipe={item}
            onPress={() => router.navigate("/recipe/" + item.id)}
          />
        )}
        style={styles.recipes}
        contentContainerStyle={styles.recipesContent}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: 16 }}
        numColumns={2}
      />
    </View>
  );
}
