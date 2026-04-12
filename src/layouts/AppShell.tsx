import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";

type AppShellProps = {
	children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
	return (
		<div className="min-h-screen bg-background">
			<TopNav />
			<main className="mx-auto max-w-180 px-6 md:px-12 py-8 md:py-12 pb-20 md:pb-0">
				{children}
			</main>
			<BottomNav />
		</div>
	);
}
