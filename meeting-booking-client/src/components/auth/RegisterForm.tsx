"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth/auth.hook";
import { registerSchema } from "@/hooks/auth/auth.schemas";
import { TRegisterUser } from "@/hooks/auth/auth.types";
import { getErrorMessage } from "@/lib/errors";

export const RegisterForm = () => {
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterUser>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (values: TRegisterUser) => {
    registerUser.mutate(values, {
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Реєстрація</CardTitle>
        <CardDescription>Створіть акаунт, щоб бронювати кімнати</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Ім&apos;я</FieldLabel>
              <Input
                id="name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Пароль</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>

            <Button
              type="submit"
              className="w-full"
              disabled={registerUser.isPending}
            >
              {registerUser.isPending ? "Створюємо..." : "Зареєструватися"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Вже є акаунт?{" "}
              <Link href="/login" className="text-foreground underline">
                Увійти
              </Link>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
