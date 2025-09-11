from django.core.management.base import BaseCommand
from api.models import Programa, Disertante
from django.utils import timezone
from datetime import datetime, timedelta, time, date
import random

class Command(BaseCommand):
    help = 'Pobla la base de datos con programas de ejemplo para la agenda, llenando la grilla horaria para cada aula.'

    def handle(self, *args, **options):
        aulas = [
            "Aula Magna", "Aula 1", "Aula 2", "Aula 3", "Aula 4", "Aula 5", "Aula 6"
        ]
        hora_inicio = time(10, 0)
        hora_fin = time(19, 0)
        intervalo = timedelta(minutes=30)
        dia_evento = date.today()
        disertantes = list(Disertante.objects.all())
        if not disertantes:
            self.stdout.write(self.style.ERROR('No hay disertantes en la base de datos.'))
            return
        count = 0
        horario_actual = datetime.combine(dia_evento, hora_inicio)
        horarios = []
        while horario_actual.time() <= hora_fin:
            horarios.append(horario_actual.time())
            horario_actual += intervalo
        # Alternar duración entre 1h y 1h30m
        duraciones = [timedelta(hours=1), timedelta(hours=1, minutes=30)]
        for aula in aulas:
            for idx, hora in enumerate(horarios):
                # Para cada horario y aula, crear 2 charlas (una de 1h y otra de 1h30m)
                for d_idx, duracion in enumerate(duraciones):
                    disertante = disertantes[(idx + aulas.index(aula) + d_idx) % len(disertantes)]
                    titulo = f"Charla de {disertante.nombre} en {aula} ({'1h' if duracion==timedelta(hours=1) else '1h30m'})"
                    descripcion = f"Descripción de ejemplo para la charla de {disertante.nombre} en {aula} a las {hora.strftime('%H:%M')}, duración {'1h' if duracion==timedelta(hours=1) else '1h30m'}."
                    hora_fin_prog = (datetime.combine(dia_evento, hora) + duracion).time()
                    # Evitar duplicados exactos
                    if not Programa.objects.filter(
                        disertante=disertante,
                        hora_inicio=hora,
                        aula=aula,
                        dia=dia_evento
                    ).exists():
                        Programa.objects.create(
                            titulo=titulo,
                            disertante=disertante,
                            hora_inicio=hora,
                            hora_fin=hora_fin_prog,
                            dia=dia_evento,
                            descripcion=descripcion,
                            aula=aula
                        )
                        count += 1
        self.stdout.write(self.style.SUCCESS(f'Total de programas creados: {count}'))
